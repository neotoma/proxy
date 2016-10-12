module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    rsync: {
      options: {
        host: process.env.PROXY_DEPLOY_HOST_USERNAME + '@' + process.env.PROXY_DEPLOY_HOST,
        recursive: true
      },
      app: {
        options: {
          exclude: [
            '.DS_Store',
            '.git*',
            'node_modules',
            '*.sublime*',
            'Gruntfile.js',
            '*.env'
          ],
          src: './',
          dest: process.env.PROXY_DEPLOY_HOST_DIR
        }
      }
    },
    sshexec: {
      options: {
        host: process.env.PROXY_DEPLOY_HOST,
        port: 22,
        username: process.env.PROXY_DEPLOY_HOST_USERNAME,
        agent: process.env.SSH_AUTH_SOCK
      },
      npmInstall: {
        command: 'cd ' + process.env.PROXY_DEPLOY_HOST_DIR + ' && npm install --production'
      },
      foreverRestartAll: {
        command: 'cd ' + process.env.PROXY_DEPLOY_HOST_DIR + ' && forever restartall'
      }
    }
  });

  grunt.registerTask('deploy', [
    'rsync:app',
    'sshexec:npmInstall',
    'sshexec:foreverRestartAll'
  ]);
};