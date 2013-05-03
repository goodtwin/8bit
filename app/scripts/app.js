"use strict";
/* global document */

define(['angular', 'jquery' ],
	function(angular, $){
	var baseurl = '/scripts/eightbit/';

	var start = function( appName ) {
		var modules = [];
		modules[0] = appName;
		init(appName);
		angular.bootstrap( $('body')[0], modules );
	};

	var init = function( appName ) {


		var eightbitapp = angular.module( appName, [] );


		eightbitapp.factory( 'EightBits',  function( $http ){
			return $http.get( 'data/seed.json' );
		});

		eightbitapp.controller( "ListCtrl", function( $scope, $routeParams, EightBits ){
			EightBits.success( function( data ){
				$scope.eightbits = data.users;
			});
		});
		
		eightbitapp.config( function( $routeProvider){
			$routeProvider
				.when('/',{
					templateUrl: baseurl + 'templates/main.html',
					controller: 'ListCtrl'
				});
		});

		//eightbitapp.controller( 'gt.ListCtrl', ListCtrl);
	}

	return {
		start: start
	};

});