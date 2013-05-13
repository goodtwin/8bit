'use strict';
define([], function(){

	var init = function( appModule ){
		appModule.factory( 'EightBits',  function( $http ){
			return $http.get('http://8bit.dev:3000/api/v1/eightbits');
		});
	};

	return {
		init: init
	};

});