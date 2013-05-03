"use strict";
/* global define */

define(["jquery", "angular", "scripts/modules/helloworld/main"],
  function( $, angular ){
    return angular.bootstrap( $("body")[0], ["helloworld"]);
  }
);