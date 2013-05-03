/* global define, $ */
"use strict";

require.config({
  "baseUrl": "/",
  "shim": {
    "angular": {
      "exports": "angular"
    },
    "angular-cookies": [
      "angular"
    ],
    "angular-mocks": [
      "angular"
    ],
    "angular-resource": [
      "angular"
    ],
    "angular-sanitize": [
      "angular"
    ],
    "angular-scenario": [
      "angular"
    ],
    "jquery": {
      "exports": "$"
    }
  },
  "paths": {
    "angular": "components/angular/angular",
    "angular-cookies": "components/angular-cookies/angular-cookies",
    "angular-mocks": "components/angular-mocks/angular-mocks",
    "angular-resource": "components/angular-resource/angular-resource",
    "angular-sanitize": "components/angular-sanitize/angular-sanitize",
    "angular-scenario": "components/angular-scenario/angular-scenario",
    "d3": "components/d3/index-browserify",
    "es5-shim": "components/es5-shim",
    "json3": "components/json3",
    "nvd3": "components/nvd3",
    "jquery": "components/jquery/jquery"
  }
});
