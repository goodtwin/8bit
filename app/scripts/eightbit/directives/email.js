'use strict';

define([],function(){

	var init = function(module, angular){

		module.directive( 'sendEmail', function($http){
			return {
				restrict: 'C', // className on the element
				link: function(scope, element){
					element.bind( 'submit', function(){
						var $ = angular.element(this).find,
							test = $( '#human' ).val(),
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
	};

	return {
		init: init
	};

});