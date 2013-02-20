/*global define, alert, console, $, document */

(function(){
	'use strict';

	define(

		[
			'components/flight/lib/component',
			'app/data',
			'hbs!app/templates/request_form',
			'/socket.io/socket.io.js'
		],

		function(defineComponent,
			dataStore,
			requestTemplate ) {

			function requestInfo() {
				/*jshint validthis:true */
				var that;

				this.getRequestForm = function( e, data ){
					this.trigger( 'requestFormServed', {
						markup: this.renderForm()
					});
				};

				this.renderForm = function( data ){
					return requestTemplate();
				};

				this.sendEmail = function( e, data ){
					$.ajax( '/email', {
							type: 'GET',
							dataType: 'json',
							data: { name: data.firstName, email: data.email, handle: data.handle, text: data.text },
							success: function(data) {
								alert( 'Thanks!' );
								that.trigger( 'emailSent' );
							},
							error  : function(data) {
								console.log( data );
							}
					});
				};

				this.after( 'initialize', function() {
					that = this;
					this.on( document, 'userMenuRendered', this.getRequestForm );
					this.on( document, 'sendEmail', this.sendEmail );
				});
			}

			return defineComponent( requestInfo );

		}
	);
})();