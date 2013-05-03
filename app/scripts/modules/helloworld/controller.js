'use strict';
/* global define */

define(['angular'],
  function( angular ){
	return angular.module('helloworld.controller', [])
	  .controller('MainCtrl', function ($scope) {
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	  });
});