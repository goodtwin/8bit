'use strict';
define([], function(){

	var init = function( appModule ){
		appModule.factory( 'EightBits',  function( $http ){
			return $http.get('/api/v1/eightbits');
		});
	};

	return {
		init: init
	};

});