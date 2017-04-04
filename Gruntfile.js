require('park-ranger')();

module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    nodemon: {
      main: {
        script: 'index.js'
      }
    }
  });

  grunt.registerTask('dev', 'Run local web server and reboot on file changes for development.', [
    'nodemon'
  ]);
};