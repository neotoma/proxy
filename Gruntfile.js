require('./lib/env');

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    rsync: {
      options: {
        args: ['--rsync-path="mkdir -p ' + process.env.PROXY_DEPLOY_HOST_DIR + ' && rsync"'],
        host: process.env.PROXY_DEPLOY_HOST_USERNAME + '@' + process.env.PROXY_DEPLOY_HOST,
        recursive: true
      },
      app: {
        options: {
          exclude: [
            '.DS_Store',
            '.git',
            '.env*',
            '.certs*',
            '*.sublime*',
            'Gruntfile.js',
            'node_modules'
          ],
          src: './',
          dest: process.env.PROXY_DEPLOY_HOST_DIR
        }
      },
      certs: {
        options: {
          src: process.env.PROXY_DEPLOY_CERTS_DIR + '/',
          dest: process.env.PROXY_DEPLOY_HOST_DIR + '/.certs/'
        }
      },
      env: {
        options: {
          src: process.env.PROXY_ENV_DEPLOY_PATH,
          dest: process.env.PROXY_DEPLOY_HOST_DIR + '/.env'
        }
      }
    },
    sshexec: {
      options: {
        host: process.env.PROXY_DEPLOY_HOST,
        username: process.env.PROXY_DEPLOY_HOST_USERNAME,
        agent: process.env.SSH_AUTH_SOCK,
        port: 22
      },
      npmInstall: {
        command: 'cd ' + process.env.PROXY_DEPLOY_HOST_DIR + ' && npm install --production'
      },
      forever: {
        command: 'cd ' + process.env.PROXY_DEPLOY_HOST_DIR + ' && forever restart app.js || forever start app.js'
      },
      systemd: {
        command: 'systemctl restart proxy || systemctl start proxy'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('rsync-conditional', 'Run rsync task only if file exists', function(target, file) {
    if (file && grunt.file.exists(file)) {
      grunt.task.run('rsync:' + target);
    }
  });

  grunt.registerTask('dev', 'Run local web server for development', [
    'nodemon:dev'
  ]);

  grunt.registerTask('deploy', 'Run tests and deploy', [
    'deploy-dependencies',
    'deploy-app'
  ]);

  grunt.registerTask('deploy-dependencies', 'Deploy environment config files and certificate files', [
    'rsync-conditional:certs:' + process.env.PROXY_DEPLOY_CERTS_DIR,
    'rsync-conditional:env:' + process.env.PROXY_ENV_DEPLOY_PATH
  ]);

  grunt.registerTask('deploy-app', 'Deploy app, install modules and start/restart', [
    'rsync:app',
    'sshexec:npmInstall'
  ]);

  grunt.registerTask('deploy-forever', 'Deploy app, install modules and start/restart with forever', [
    'deploy',
    'sshexec:forever'
  ]);

  grunt.registerTask('deploy-systemd', 'Deploy app, install modules and start/restart with systemd', [
    'deploy',
    'sshexec:systemd'
  ]);
};