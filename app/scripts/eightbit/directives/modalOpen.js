'use strict';

define([],function(){

	var init = function( module, angular ){
		module.directive('modalOpen', function() {
			return function(scope, element, attrs) {

				var modal, body, backdrop;

				angular.element(element).bind('click', function() {
					// probably should have initialized these locally... 
					var modal = angular.element(document.getElementById(attrs.modalOpen)),
						body = angular.element(document).find('body');

					// add backdrop div even if there won't be a backdrop. probably not neccesary
					body.append('<div id="modal-backdrop"></div>');
					var backdropAttr = attrs.hasOwnProperty('backdrop') ? attrs.backdrop : true;
					var escapeAttr = attrs.hasOwnProperty('escapeExit') ? attrs.escapeExit : true;
					var backdrop = angular.element(document.getElementById('modal-backdrop'));

					// typechecking boolean values but not string. not sure why.
					if (backdropAttr === true || backdropAttr === 'static') {
						backdrop.addClass('modal-backdrop');

						if (backdropAttr !== 'static') {
							// calling the callback within the bind breaks the backdrop (weird)
							angular.element(backdrop).bind('click', function() {
								closeModal();
							});
						}
					}

					if (escapeAttr === true) {
						angular.element(body).bind('keypress', function(e) {
							if (e.keyCode === 27) {
								closeModal();
							}
						});
					}

					body.addClass('modal-open');
					modal.css('display', 'block');
				});

				var closeModal = function() {
					// backdrop could be null but shouldn't ever be undefined. 
					if (typeof backdrop !== 'undefined' && backdrop !== null) {
						backdrop.unbind();
						backdrop.remove();
					}

					angular.element(body).unbind('keypress');
					modal.css('display', 'none');

					body.removeClass('modal-open');
				};
			};
		});
	};

	return {
		init: init
	};
});