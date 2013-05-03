/* global requirejs Object window */

var tests = Object.keys(window.__karma__.files).filter(function (file) {
      return /Spec\.js$/.test(file);
});

requirejs.config({
  // Karma serves files from '/base'
  "baseUrl": "/base",
  "shim": {
    "angular": {
      "exports": "angular"
    },
    "angular-cookies": [
      "angular"
    ],
    "angular-mocks": {
        deps: [ "angular" ],
        exports : "angular.mock"
    },
    "angular-resource": [
      "angular"
    ],
    "angular-sanitize": [
      "angular"
    ],
    "angular-scenario": [
      "angular"
    ],
    "jquery" : {
      "exports" : "$"
    }
  },
  "paths": {
    "angular": "app/components/angular/angular",
    "angular-cookies": "app/components/angular-cookies/angular-cookies",
    "angular-mocks": "app/components/angular-mocks/angular-mocks",
    "angular-resource": "app/components/angular-resource/angular-resource",
    "angular-sanitize": "app/components/angular-sanitize/angular-sanitize",
    "angular-scenario": "app/components/angular-scenario/angular-scenario",
    "d3": "app/components/d3/index-browserify",
    "es5-shim": "app/components/es5-shim",
    "json3": "app/components/json3",
    "nvd3": "app/components/nvd3",
    "jquery": "app/components/jquery/jquery"
  },

  // ask Require.js to load these files (all our test
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});