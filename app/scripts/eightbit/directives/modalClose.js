'use strict';

define([],function(){

	var init = function( module, angular ){

		module.directive('modalClose', function() {
			return function(scope, element, attrs) {
				angular.element(element).bind('click', function() {
					var modal = document.getElementById(attrs.modalClose),
						backdrop = document.getElementById('modal-backdrop'),
						body = angular.element(document).find('body');

					angular.element(backdrop).unbind().remove();
					angular.element(body).unbind('keypress');
					angular.element(modal).css('display', 'none');

					body.removeClass('modal-open');
				});
			};
		});

	};

	return {
		init: init
	};
});