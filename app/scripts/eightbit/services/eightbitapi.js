'use strict';
define([], function(){

	var init = function( appModule ){
		appModule.factory( 'EightBits',  function( $http ){
			var api = window.location.hostname === '8bit.dev' ? 'http://8bit.dev:3000/api/v1/eightbits' : '/api/v1/eightbits';
			return $http.get(api);
		});
	};

	return {
		init: init
	};

});