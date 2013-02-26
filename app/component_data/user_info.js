/*global define, io, $, window, console */

( function(){
	'use strict';

	define(

		[
			'components/flight/lib/component',
			'app/data',
			'hbs!app/templates/user_menu',
			'config',
			'/socket.io/socket.io.js'
		],

		function(defineComponent,
			dataStore,
			menuTemplate,
			appconfig ) {

			function userInfo() {
				/*jshint validthis:true */
				
				var that;

				this.startOAuth = function( ev, data ) {
					var socket = io.connect( 'http://' + appconfig.baseuri + ':8000' );
					socket.emit( 'db data request' );
				};

				this.setData = function( data ){
					dataStore.users = data.users;

					// need to check auth status, and inform app if user is auth'd
					$.ajax({
						url : 'auth/status',
						dataType: 'JSON'
					}).done( function( userOauth ){
						if( userOauth ){
							var authUserInDataStore = that.getUserByScreenName( userOauth );
							if( authUserInDataStore ){
								that.trigger( 'localUserServed', { details: authUserInDataStore } );
							}
							else{
								that.trigger( 'localUserServed', {
									dummy: dataStore.dummyUsers,
									handle: userOauth.screen_name
								});
							}
						}

						that.trigger( 'userInfoServed', {
							markup: that.renderMenu({
								oauth: userOauth
							})
						});
					});

					that.trigger( 'eightBitsDataServed', { eightBits: data.users });

				};

				this.getUserByScreenName = function( user ){
					var match = dataStore.users.filter( function ( dsUser ) {
						return dsUser.handle == user.screen_name;
					});
					return match[0];
				};
				
				this.renderMenu = function( data ){
					return menuTemplate( data );
				};

				this.postTweet = function( e, data ){
					$.ajax('/auth/twitter/tweet', {
							type: 'GET',
							dataType: 'json',
							data: { status: data.status },
							success: that.trigger( 'userTweetPosted', data ),
							error  : function(){
							}
					});
				};

				this.requestLogIn = function( e, data ){
					var username = data.username;
					window.location.href = '/auth/twitter?username=' + username;
				};

				this.after( 'initialize', function() {
					that = this;
					this.on( 'userInfoRequested', this.startOAuth );
					this.on( 'postTweet', this.postTweet );
					this.on( 'requestLogIn', this.requestLogIn );

					var socket = io.connect( 'http://' + appconfig.baseuri + ':8000' );
					socket.on( 'db data returned', this.setData );
				});
			}

			return defineComponent(userInfo);

		}
	);
})();