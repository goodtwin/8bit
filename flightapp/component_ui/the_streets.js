/*global define, Keys, io, console, $, window, document, setTimeout */

( function(){
	'use strict';

	define(
		[
			'components/flight/lib/component',
			'public/js/OmahaCharacter',
			'public/js/LocalCharacter',
			'config',
			'/socket.io/socket.io.js'
		],

		function(defineComponent,
			OmahaCharacter,
			LocalCharacter,
			appconfig) {

			return defineComponent(theStreets);

			function theStreets() {
				/*jshint validthis:true */

				var ctx,      // Canvas rendering context
					keys,     // Keyboard input
					omahaPlayers,   // 'Static' players
					localPlayer,  // Local player
					remotePlayers,  // Remote players
					tweeter,
					tweet,
					socket,     // Socket connection
					that,
					SET_TIMEOUT = 250;

				this.defaultAttrs({
					canvasSelector : '#street',
					tweetBubbleSelector : '.tweet-bubble',
					tweetSelector : '.tweet',
					tweeterSelector : '.tweeter'
				} );

				this.showCanvas = function( e, data ){
					this.$node.html( data.markup );
					// Declare rendering context
					ctx = this.select( 'canvasSelector' )[0].getContext( '2d' );

					// Set canvas size
					this.select( 'canvasSelector' ).attr( 'width', window.innerWidth );
					this.select( 'canvasSelector' ).attr( 'height', 490 );

					this.trigger( 'canvasShown' );
				};

				this.initializeGame = function( e, data ){
					// Initialize keyboard controls
					keys = new Keys();

					// Initialize Omaha
					this.trigger( 'eightBitsRequested' );

					// Initialize socket connection
					socket = io.connect( 'http://' + appconfig.baseuri, {transports: ['websocket']} );

					// Initialize remote players array
					remotePlayers = [];

					this.trigger( 'gameInitialized' );
				};

				this.animateFrame = function(){
					that.trigger( 'update' );
					that.trigger( 'draw' );
					window.requestAnimFrame( that.animateFrame );
				};

				this.update = function(){
					// Update local player and check for change
					if( localPlayer ){
						if ( localPlayer.update( keys ) ) {
						}
					}

					// Update the Omaha players position
					var i;
					for ( i = 0; i < omahaPlayers.length; i++ ) {
						omahaPlayers[i].update( ctx );
					}
				};

				this.draw = function() {
					// Wipe the canvas clean
					var i;
					ctx.clearRect( 0, 0, this.select( 'canvasSelector' ).width(), this.select( 'canvasSelector' ).height());

					// Draw the Omaha players
					for ( i = 0; i < omahaPlayers.length; i++ ) {
						omahaPlayers[i].draw( ctx );
					}

					// Draw the remote players
					for ( i = 0; i < remotePlayers.length; i++ ) {
						var next = remotePlayers[i].coords();
						remotePlayers[i].draw( ctx, next.x, next.y );
					}

					// Draw the local player
					if( localPlayer ){
						localPlayer.draw( ctx );
					}

					if( ( typeof tweeter !== 'undefined' ) && ( tweeter !== false ) ){
						this.select( 'tweetBubbleSelector' ).show().css( { 'top': tweeter.y , 'left': tweeter.x - 45 } );
					}
				};

				// Keyboard key down
				this.onKeydown = function( e ) {
					if ( localPlayer ) {
						keys.onKeyDown( e );
					}
					if( e.keyCode == 37 || e.keyCode == 38  || e.keyCode == 39 || e.keyCode == 40 ){
						e.preventDefault();
					}
				};

				// Keyboard key up
				this.onKeyup = function( e ) {
					if ( localPlayer ) {
						keys.onKeyUp( e );
					}
					if( e.keyCode == 37 || e.keyCode == 38  || e.keyCode == 39 || e.keyCode == 40 ){
						e.preventDefault();
					}
				};

				// Browser window resize
				this.onResize = function( e ) {
					this.select( 'canvasSelector' ).attr( 'width', window.innerWidth );
				};

				// Socket connected
				this.onSocketConnected = function() {
					//socket = io.connect( 'http://localhost' );
					console.log( 'Connected to socket server' );
				};

				// Socket disconnected
				this.onSocketDisconnect = function() {
					console.log( 'Disconnected from socket server' );
				};

				// New player
				this.onNewPlayer = function( data ) {
					console.log( 'New player connected: ' + data.id );

					// Initialize the new player
					var newPlayer = new LocalCharacter( {
										$canvas : that.select( 'canvasSelector' ),
										id : data.id,
										handle : data.handle,
										imgUri : data.img,
										startX : data.x,
										startY : data.y
									} );

					// Add new player to the remote players array
					remotePlayers.push(newPlayer);

					that.removeFromOmahaPlayers( { handle: newPlayer.handle } );
					
					//newPlayer.draw( ctx );
				};

				// Move player
				this.onMovePlayer = function( data ) {
					// var movePlayer = that.playerById( data.id );

					// // Player not found
					// if ( !movePlayer ) {
					// 	console.log( 'Player not found: ' + data.id );
					// 	return;
					// }

					// // Update player position
					// movePlayer.setX( data.x );
					// movePlayer.setY( data.y );
					// movePlayer.draw( ctx );
				};

				// Remote Snapshot
				this.onRemoteSnapshot = function( data ) {
					//console.log(data);
					for ( var i = 0; i < data.length; i++ ) {
						var movePlayer = that.remotePlayerByHandle( data[i].handle );

						if ( movePlayer ) {
							// Update player position
							// movePlayer.stepValues.x = Math.abs(data[i].x - movePlayer.x) / 200 /* sending interval */;
							// movePlayer.stepValues.y = Math.abs(data[i].y - movePlayer.y) / 200 /* sending interval */;
							// movePlayer.target.x = data.x;
							// movePlayer.target.y = data.y;
							movePlayer.queue( data[i].x, data[i].y );
							//movePlayer.setY( data[i].y );
						}
						//that.trigger( 'update' );
						//that.trigger( 'draw' );
					}
				};

				// Remove player
				this.onRemovePlayer = function( data ) {
					var removePlayer = that.playerById( data.id );

					// Player not found
					if (!removePlayer) {
						console.log( 'Player not found: ' + data.id );
						return;
					}

					// Remove player from array
					remotePlayers.splice( remotePlayers.indexOf( removePlayer ), 1 );
				};

				this.playerById = function(id) {
					for ( var i = 0; i < remotePlayers.length; i++ ) {
						if ( remotePlayers[i].id == id )
							return remotePlayers[i];
					}

					return false;
				};

				this.omahaPlayerByHandle = function( handle ) {
					var thePlayer;
					for ( var i = 0; i < omahaPlayers.length; i++ ) {
						if ( omahaPlayers[i].handle.toLowerCase() == handle.toLowerCase()){
							thePlayer = omahaPlayers[i];
						}
					}
					return thePlayer;
				};

				this.remotePlayerByHandle = function( handle ) {
					var thePlayer;
					for ( var i = 0; i < remotePlayers.length; i++ ) {
						if ( remotePlayers[i].handle.toLowerCase() == handle.toLowerCase()){
							thePlayer = remotePlayers[i];
						}
					}
					return thePlayer;
				};

				this.localPlayerByHandle = function( handle ) {
					var thePlayer;
					if ( ( localPlayer && localPlayer.handle.toLowerCase() ) == handle.toLowerCase()){
						thePlayer = localPlayer;
					}
					return thePlayer;
				};

				this.createOmahaPlayers = function( e, data ){
					omahaPlayers = [];
					for ( var i = 0; i < data.users.length; i++ ) {
						var id = ( data.users[i].first_name + '-' + data.users[i].last_name).replace( /\s/g, '' ),
							newPlayer = new OmahaCharacter( {
								$canvas : that.select( 'canvasSelector' ),
								id : id,
								handle : data.users[i].handle,
								imgUri : $( '.-bit_' + id).css( 'background-image' ).replace( 'url(', '' ).replace( ')', '' )
							} );

						omahaPlayers.push( newPlayer );
					}
				};

				this.createlocalPlayer = function( e, data ) {
					// Initialize the local player
					var id;
					if( typeof data.details !== 'undefined') {
						id = ( data.details.first_name + '-' + data.details.last_name ).replace( /\s/g, '' );

						localPlayer = new LocalCharacter( {
											$canvas : that.select( 'canvasSelector' ),
											id : id,
											handle : data.details.handle,
											imgUri : $( '.-bit_' + id ).css( 'background-image' ).replace( 'url(', '' ).replace( ')', '' )
										} );

						this.removeFromOmahaPlayers( { handle: localPlayer.handle } );

						socket.emit( 'new player', {
							x : localPlayer.getX(),
							y : localPlayer.getY(),
							handle : localPlayer.handle,
							img : localPlayer.img.src
						} );

						setInterval( function(){
							that.checkLocalPlayerMove(); },
						SET_TIMEOUT);
					}
					else if ( typeof data.handle !== 'undefined') {
						var characterNumber = Math.floor(Math.random() * (5 + 1));
						id = ( data.dummy[characterNumber].first_name + '-' + data.dummy[characterNumber].last_name ).replace( /\s/g, '' );
						localPlayer = new LocalCharacter( {
											$canvas : that.select( 'canvasSelector' ),
											id : id,
											handle: data.handle,
											imgUri : data.dummy[characterNumber].imgUri
										} );

						socket.emit( 'new player', {
							x : localPlayer.getX(),
							y : localPlayer.getY(),
							handle : localPlayer.handle,
							img : localPlayer.img.src
						} );

						setInterval( function(){
							that.checkLocalPlayerMove(); },
						SET_TIMEOUT);

					}
				};

				this.checkLocalPlayerMove = function(){
					if( (localPlayer.getX() !== localPlayer.getLastX()) || (localPlayer.getY() !== localPlayer.getLastY()) ){
						socket.emit( 'move player', {
								x: localPlayer.getX(),
								y: localPlayer.getY(),
								handle: localPlayer.handle,
								img: localPlayer.img.src
							});
						localPlayer.setLastX( localPlayer.getX() );
						localPlayer.setLastY( localPlayer.getY() );
					}
				};

				this.removeFromOmahaPlayers = function( data ){
					var match = omahaPlayers.filter( function ( user ) {
						return user.handle == data.handle;
					});
					omahaPlayers.splice( omahaPlayers.indexOf( match[0] ), 1 );
				};

				this.onNewTweet = function( data ){
					var newTweet = typeof JSON.parse( data.tweet ) == 'undefined' ? data.tweet : JSON.parse( data.tweet );
					var newTweeter = that.omahaPlayerByHandle( newTweet.user.screen_name ) ||
						that.remotePlayerByHandle( newTweet.user.screen_name ) ||
						that.localPlayerByHandle( newTweet.user.screen_name );
					
					if ( typeof newTweeter !== 'undefined' ) {
						tweet = newTweet;
						tweeter = newTweeter;
						
						var tweetText = newTweet.text.replace( /(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>' );
						tweetText = tweetText.replace( /(^|\s)@(\w+)/g, '$1<a href="http://www.twitter.com/$2">@$2</a>' );
						
						that.select( 'tweetBubbleSelector' ).show();
						that.select( 'tweetSelector' ).html( tweetText );
						that.select( 'tweeterSelector' ).attr( 'href', 'http://twitter.com/' + newTweet.user.screen_name );
					}

					setTimeout( function(){
						tweeter = false;
						that.select( 'tweetBubbleSelector' ).hide();
					}, 12000 );
				};

				this.after( 'initialize', function() {
					that = this;
					this.on( document, 'theStreetsServed', this.showCanvas );
					this.on( document, 'canvasShown', this.initializeGame );
					this.on( document, 'gameInitialized', this.animateFrame );
					this.on( document, 'eightBitsServed', this.createOmahaPlayers );
					this.on( document, 'localUserServed', this.createlocalPlayer );
					

					this.on( document, 'update', this.update );
					this.on( document, 'draw', this.draw );
					this.on( document, 'keydown', this.onKeydown );
					this.on( document, 'keyup', this.onKeyup );
					this.on( window, 'resize', this.onResize );


					var socket = io.connect( 'http://' + appconfig.baseuri, {transports: ['websocket']} );
					socket.on( 'connect', this.onSocketConnected );
					socket.on( 'disconnect', this.onSocketDisconnect );
					socket.on( 'new player', this.onNewPlayer );
					socket.on( 'move player', this.onMovePlayer );
					socket.on( 'remote snapshot', this.onRemoteSnapshot );
					socket.on( 'remove player', this.onRemovePlayer );
					socket.on( 'new tweet', this.onNewTweet );
				});
			}
		}
	);

})();
