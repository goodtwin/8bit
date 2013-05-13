'use strict';

define([], function(){

	var init = function( module ){
		module.filter( 'exists', function(){
			return function( resp, conditional ){
				return conditional ? resp : '';
			};
		});
	};

	return {
		init: init
	};

});
