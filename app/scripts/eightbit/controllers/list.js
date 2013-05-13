'use strict';

define([],function(){
	var init = function( module ){
		module.controller( 'ListCtrl', function(
			$scope,
			$routeParams,
			EightBits ){
				EightBits.success( function( data ){
					$scope.eightbits = data;
				});
			});
	};

	return {
		init: init
	};
});