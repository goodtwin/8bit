'use strict';

define(['angular', 'jquery' ],
	function(angular, $){

	var start = function( appName ) {
		var modules = [];
		modules[0] = appName;
		init(appName);
		angular.bootstrap( $('body')[0], modules );
	};

	var init = function( appName ) {


		var eightbitapp = angular.module( appName, [] );


		eightbitapp.factory( 'EightBits',  function( $http ){
			return $http.get( 'data/seed.json' );
		});

		eightbitapp.controller( 'ListCtrl', function( $scope, $routeParams, EightBits ){
			EightBits.success( function( data ){
				$scope.eightbits = data;
			});
		});

		eightbitapp.config( function( $routeProvider){
			$routeProvider
				.when('/',{
					templateUrl: '/views/main.html',
					controller: 'ListCtrl'
				});
		});


		eightbitapp.filter( 'trim', function(){
			return function( str ){
				return str && str.replace( ' ', '' );
			};
		});

		eightbitapp.filter( 'exists', function(){
			return function( resp, conditional ){
				return conditional ? resp : '';
			};
		});

		eightbitapp.directive( 'flip', function(){
			return {
				restrict: 'C',
				link: function(scope, element){
					element.bind('click', function(){
						$(this).toggleClass('flipped');
						$(this).siblings().removeClass('flipped');
					});
				},
			};
		});

		eightbitapp.directive( 'sendEmail', function($http){
			return {
				restrict: 'C',
				link: function(scope, element){
					element.bind('click', function(){
						var test = $( '#human' ).val(),
							firstName = $( '#first_name' ).val(),
							email = $( '#email' ).val(),
							handle = $( '#handle' ).val(),
							text = $( '#request-box-text' ).val(),
							data = {},
							modelOpen = angular.element(document.getElementById('modal-open'));

						if( test === '8' ){
							data = {
								'name': firstName,
								'email': email,
								'handle': handle,
								'text': text
							};

							$http.post('/email', data )
								.success(function(data) {
									console.log(data);
									//window.alert('Thanks!');
									$('#myModal .modal-body').html('Sweet. Got it.');
									modelOpen.triggerHandler('click');
								})
								.error(function(data) {
									console.log(data);
									$('#myModal .modal-body').html('Bummer. I can\'t really say what\'s wrong, but it\'s bad.');
									modelOpen.triggerHandler('click');
								});
						}
						else {
							$('#myModal .modal-body').html('Bummer. Make sure you put stuff in all the fields.');
							modelOpen.triggerHandler('click');
						}
						return false;
					});
				},
			};
		});

		eightbitapp.directive('modalOpen', function() {
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

		eightbitapp.directive('modalClose', function() {
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
		start: start
	};

});