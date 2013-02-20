/*global define, document  */

(function(){
	'use strict';

	define(

		[
			'components/flight/lib/component',
			'app/data',
			'hbs!app/templates/the_streets',
			'/socket.io/socket.io.js'
		],

		function(defineComponent,
			dataStore,
			streetsTemplate ) {
			
			function streetInfo(){
				/*jshint validthis:true */

				this.getTheStreets = function( e, data ){
					this.trigger( 'theStreetsServed', {
						markup: this.renderTheStreets( { oauth: data.oauth, results: data.results } ),
						oauth: data.oauth,
						results: data.results } );
				};

				this.renderTheStreets = function( data ){
					return streetsTemplate( data );
				};

				this.getEightBits = function( e, data ){
					this.trigger( 'eightBitsServed',  {
						users: dataStore.users,
						oauth: dataStore.oauth,
						results: dataStore.results } );
				};

				this.after("initialize", function() {
					this.on( document, 'playerCardsShown', this.getTheStreets );
					this.on( document, 'eightBitsRequested', this.getEightBits );
				});
			}

			return defineComponent( streetInfo );

		}
	);
})();
