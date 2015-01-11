module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    options: {
      separator: ';',
    },
    dist: {
        src: ['app.js', 'controllers/*.js', 'services/*.js', 'directives/*.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> x */\n',
        compress: false,
        mangle: false
      },
      build: {
        src: ['app.js', 'controllers/*.js', 'services/*.js', 'directives/*.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

};