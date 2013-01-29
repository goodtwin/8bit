module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'public/js/*.js', 'test/**/*.js']
    },
    qunit: {},
    concat: {},
    min: {},
    jshint: {
      options: {
        browser: true
      }
    },
    grunticon: {
      src: "public/img/8bits/",
      dest: "public/style/8bits/",
      cssprefix: "bit-"
    },
    watch: {
     files: '<config:grunticon.files>',
      tasks: 'default'
  }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-grunticon');

  // Default task.
  grunt.registerTask('default', 'grunticon');

};