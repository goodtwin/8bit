'use strict';

define([],function(){

	var init = function( module, angular ){
		module.directive( 'flip', function(){
			return {
				restrict: 'C',
				link: function(scope, element){
					element.bind('click', function(){
						angular.element(this).toggleClass('flipped');
					});
				},
			};
		});
	};

	return {
		init: init
	};
});