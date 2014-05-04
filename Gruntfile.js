module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    env : {
      development : {
        NODE_ENV: 'development'
      }
    },

    express: {
      development: {
        options: {
          script: 'app.js'
        }
      }
    },

    watch: {
      express: {
        files:  ['app.js', 'lib/lists.js', 'lib/*', 'Gruntfile.js'],
        tasks:  ['express:development'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-env');

  grunt.loadTasks("tasks");

  grunt.registerTask('default', ['server']);
  grunt.registerTask('server', [
    'env:development',
    'express:development',
    'watch'
  ]);
};
