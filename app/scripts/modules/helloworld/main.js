'use strict';
/* global define */

define(['angular', './controller'],
  function( angular ){

  return angular.module('helloworld', [ 'helloworld.controller' ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    });

});