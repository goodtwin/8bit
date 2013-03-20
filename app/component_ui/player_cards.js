/*global define, $, document */

(function(){
	'use strict';

	define(

		[
			'components/flight/lib/component'
		],

		function(defineComponent) {

			return defineComponent( playerCards );

			function playerCards() {
				/*jshint validthis:true */

				this.defaultAttrs( {
					visualSelector : '.visual',
					detailsSelector : '.details',
					setAsSelector : '.set-as',
					downloadSelector : '.download',
					eightBitSelector: '.eight-bit',
					eightBitInnerSelector: '.eight-bit-inner',
					flippedClass: 'flipped'
				} );

				this.showCards = function( e, data ){
					this.$node.html( data.markup );
					this.trigger( 'playerCardsShown' );
				};

				this.setUserInteractions = function( e, data ){
					var userHandle = data.details ?
						data.details.handle :
						data.handle;
					$( '.' + userHandle ).addClass( 'user' );
					$( '.' + userHandle + ' .details .detail_btn' ).remove();
					$( '.' + userHandle + ' .details' )
						.append( '<a href="#" class="detail_btn download">Download 8-Bit</a>' );
				};

				this.flipToggle = function(e){
					var that = $( e.target ).closest( this.select( 'eightBitSelector' ) );
					that.toggleClass( this.attr.flippedClass );
					that.siblings().removeClass( this.attr.flippedClass );
				};

				this.downloadEightBit = function( e, data ){
					e.preventDefault();
					var id = data.el.offsetParent.id;
					this.trigger('requestDownload', { id: id });
				};

				this.setAsProfile = function( e, data ){
					e.preventDefault();
					var id = data.el.offsetParent.id;
					this.trigger('requestProfilePost', { id: id });
				};
				
				this.after( 'initialize', function() {
					this.on( document, 'playerCardsServed', this.showCards );
					this.on( document, 'localUserServed', this.setUserInteractions );
					this.on( 'click',  {
						eightBitSelector: this.flipToggle,
						setAsSelector : this.setAsProfile,
						downloadSelector : this.downloadEightBit
					} );
				});
			}
		}
	);
})();
