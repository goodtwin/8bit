/*global define, $, document */


(function(){
	'use strict';

	define(

		[
			'components/flight/lib/component'
		],

		function(defineComponent) {

			return defineComponent(userMenu);

			function userMenu() {
				/*jshint validthis:true */
				
				this.defaultAttrs({
					logInSubmitSelector : '.login-submit',
					tweetSubmitSelector: '.tweet-submit',
					tweetBoxSelector: '.tweet-box textarea',
					usernameSelector: '#twitter_screen_name',
					passwordSelector: '#twitter_password',
					requestSelector: '.request'
				});

				this.showUser = function( e, data ){
					this.$node.html( data.markup );
					this.trigger('userMenuRendered', data );
				};

				this.logIn = function( e, data ){
					e.preventDefault();
					var username = this.select( 'usernameSelector' ).val();
					this.trigger( 'requestLogIn', { username: username } );
				};

				this.submitTweet = function( e, data ){
					e.preventDefault();
					var status = this.select( 'tweetBoxSelector' ).val();
					if( status.length > 0 ){
						this.trigger( 'postTweet', { status: status } );
					}
				};

				this.userTweetPosted = function( e, data ){
					this.select( 'tweetBoxSelector' ).val( '' );
					$( 'html, body' ).animate( { scrollTop: 0 }, 'fast' );
				};

				this.after('initialize', function() {
					this.on( document, 'userInfoServed', this.showUser );
					this.on( document, 'userTweetPosted', this.userTweetPosted );
					this.on( 'click',  {
						tweetSubmitSelector : this.submitTweet,
						logInSubmitSelector : this.logIn
					} );

					this.trigger('userInfoRequested');
				});
			}
		}
	);
})();
