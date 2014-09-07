module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            unit: {
                configFile: 'karma.config.js'
            }
        }
    });

    grunt.registerTask('default', []);

 };