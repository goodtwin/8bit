'use strict';
/* global define */

define(['angular'],
  function( angular ){
	return angular.module('startupgenomeApp', [])
	  .controller('MainCtrl', function ($scope) {
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	  });
});
