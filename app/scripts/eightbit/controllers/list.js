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
				// $scope.form = {
				// 	first_name : '',
				// 	email : '',
				// 	handle : '',
				// 	text : '',
				// 	human : ''
				// };
			});
	};

	return {
		init: init
	};
});