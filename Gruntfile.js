module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    qunit: {},
    concat: {},
    min: {},
    jshint: {
      all: ['public/js/*.js', 'app/component_data/*.js', 'app/component_ui/*.js', 'app/boot/*.js']
    },
    grunticon: {
      src: "public/img/8bits/",
      dest: "public/style/8bits/",
      cssprefix: "-"
    },
    watch: {
      files: '<config:grunticon.files>',
      tasks: 'default'
    },
    symlink: {
      local: {
        relativeSrc: 'config/local.js',
        dest: 'appconfig.js'
      },
      staging: {
        relativeSrc: 'config/staging.js',
        dest: 'appconfig.js'
      },
      prod: {
        relativeSrc: 'config/prod.js',
        dest: 'appconfig.js'
      }
    }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-symlink');
  
  // Default task.
  grunt.registerTask('default', 'jshint');
  grunt.registerTask('local', ['jshint','symlink:local']);
  grunt.registerTask('staging', ['jshint','symlink:staging']);
  grunt.registerTask('prod', ['jshint','symlink:prod','concat','min']);

};