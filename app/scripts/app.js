'use strict';

define(['angular',
	'jquery',
	'underscore',
	'scripts/eightbit/controllers/list',
	'scripts/eightbit/directives/email',
	'scripts/eightbit/directives/flip',
	'scripts/eightbit/directives/modalOpen',
	'scripts/eightbit/directives/modalClose',
	'scripts/eightbit/filters/exists',
	'scripts/eightbit/filters/trim' ],
	function(angular,
		$,
		_,
		listController,
		emailDirective,
		flipDirective,
		modalOpenDirective,
		modalCloseDirective,
		existsFilter,
		trimFilter){

	var start = function( appName, serviceProviders ) {
		var modules = [];
		modules[0] = appName;
		init(appName, serviceProviders);
		angular.bootstrap( $('body')[0], modules );
	};

	var init = function( appName, serviceProviders ) {

		var eightbitapp = angular.module( appName, [] ),
			appComponents = [
				listController,
				emailDirective,
				flipDirective,
				modalOpenDirective,
				modalCloseDirective,
				existsFilter,
				trimFilter
			];

		// add injected service providers to the list of app
		// components
		appComponents = appComponents.concat(serviceProviders);

		// init each component to be used in the app
		_.each( appComponents, function(appComponent){
			appComponent.init(eightbitapp, angular);
		});

		eightbitapp.config( function( $routeProvider){
			$routeProvider
				.when('/',{
					templateUrl: '/views/main.html',
					controller: 'ListCtrl'
				});
		});


	};

	return {
		start: start
	};

});