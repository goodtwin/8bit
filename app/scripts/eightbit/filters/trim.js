'use strict';

define([], function(){

	var init = function( module ){
		module.filter( 'trim', function(){
			return function( str ){
				return str && str.replace( ' ', '' );
			};
		});
	};

	return {
		init: init
	};

});