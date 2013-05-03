/*global define, $, window, document */
(function(){
	'use strict';

	define(

		[
			'components/flight/lib/component',
			'app/data',
			'hbs!app/templates/player_cards',
			'/socket.io/socket.io.js'
		],

		function(defineComponent,
			dataStore,
			cardsTemplate ) {

			function cardsInfo() {
				/*jshint validthis:true */

				this.getPlayerCards = function( e, data ){
					this.trigger( 'playerCardsServed', {
						markup: this.renderCards( { users: dataStore.users } ),
						oauth: dataStore.oauth,
						results: dataStore.results
					});
				};

				this.renderCards = function( data ){
					return cardsTemplate( data );
				};

				this.requestProfilePost = function( e, data ){
					$.ajax('/auth/twitter/set-profile', {
							type: 'GET',
							dataType: 'json',
							data: { id: data.id }
					});
				};

				this.requestDownload = function( e, data ){
					window.location.href = '/auth/twitter/download/' + data.id;
				};

				this.after( 'initialize', function() {
					this.on( document, 'eightBitsDataServed', this.getPlayerCards );
					this.on( document, 'requestProfilePost', this.requestProfilePost );
					this.on( document, 'requestDownload', this.requestDownload );
				});
			}

			return defineComponent( cardsInfo );

		}
	);
})();