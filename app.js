/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var express = require( 'express' ),
	app = express(),
	cons = require( 'consolidate' ),
    swig = require( 'swig' ),
    http = require( 'http' ),
    server = http.createServer(app),
    MongoClient = require( 'mongodb' ).MongoClient,
    mongojs = require( 'mongojs' ),
    OAuth= require( 'oauth' ).OAuth,
  	util = require( 'util' ),					
	io = require( 'socket.io' ),
	socket = io.listen(server),				
	Player = require( './Player' ).Player;	

	server.listen(8000);

	// Mongo
	var databaseUrl = '8bit', // "username:password@example.com/mydb"
		collections = ['users'],
		db = mongojs.connect(databaseUrl, collections),
		dbUsers,
		dbTwitterIds = [];
	
	db.users.find(function(err, users) {
		if( err || !users ) console.log( 'User not saved' );
		else dbUsers = users;
		beginTwitterStream();
	});
	
	// Twitter
	var oa = new OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		'8YVoUbVLwaWmoxLgPk5nqg',
		'rlj9GEYPY5Lo07odlib4MgRiIl0T2Au7B2O6d2gfFc',
		'1.0A',
		'http://localhost:8000/i',
		'HMAC-SHA1'
	);
	
	var lastTweet;
	var oauthResults;

	function beginTwitterStream() {
		for (var i = 0; i < dbUsers.length; i++) {
			dbTwitterIds.push( dbUsers[i].twitter_id );
		};
		dbTwitterIds = dbTwitterIds.join(",");

		var request = oa.get( 
			'https://stream.twitter.com/1/statuses/filter.json?follow=' + dbTwitterIds, 
			'15099732-WJfpG9YEuaVpOYL5cyAx5rHHHBYYwa3GW4kSeRGLI', 
			'6IoTSV1dPSRTI0y7pfKWoy08y8NmAA6Zw8Tl47jloo' 
		);
		request.addListener( 'response', function( response ) {
			response.setEncoding( 'utf8' );
			response.addListener( 'data',  function( chunk ) {
				if( chunk.length > 2 ){
					socket.sockets.emit( 'new tweet', { tweet: chunk } );
					lastTweet = chunk;
				};
		  });
		  response.addListener( 'end', function () {
				console.log( '--- END ---' );
		  });
		});
		request.end();
	};

	// Swig
	swig.init({
		cache: false,
	    root: __dirname + '/views',
	    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
	});

	//Express
	app
		.use( express.cookieParser() )

		.use( express.session( { secret: 'goodtwin' } ) )

		.use( express.static( __dirname ) )
		
		.engine( '.html', cons.swig )
		
		.set( 'view engine', 'html' )
		
		.set( 'views', __dirname + '/views' )
		
		.get( '/', function( req, res ) {
			if (req.session.oauth) {
				// req.session.oauth.verifier = req.query.oauth_verifier;
				// console.log('1: '+ util.inspect( req.session.oauth ) );
				// var oauth = req.session.oauth;

				// oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
				// function(error, oauth_access_token, oauth_access_token_secret, results){			
				// 	if (error){
				// 		console.log('2: '+ util.inspect( error ) );
				// 		res.render( 'index.html' );
				// 	} else {
				// 		console.log('3: '+ util.inspect( req.session.oauth ) );
				// 		req.session.oauth.access_token = oauth_access_token;
				// 		req.session.oauth.access_token_secret = oauth_access_token_secret;
				// 		oauthResults = results;
				// 		res.render( 'index.html' );
				// 	}
				// }
				// );
				res.redirect( '/auth/twitter' )
			} 
			else {
				//console.log('4');
				res.render( 'index.html' );
			}
		})
		.get( '/i', function( req, res ) {
			if (req.session.oauth) {
				req.session.oauth.verifier = req.query.oauth_verifier;
				console.log('1: '+ util.inspect( req.session.oauth ) );
				var oauth = req.session.oauth;
				
				if( oauth.request_token_used ){
					res.redirect( '/auth/twitter' );
				}
				else{
					oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
					function(error, oauth_access_token, oauth_access_token_secret, results){			
						if (error){
							console.log('2: '+ util.inspect( error ) );
							res.render( 'index.html' );
						} else {
							console.log('3: '+ util.inspect( req.session.oauth ) );
							req.session.oauth.access_token = oauth_access_token;
							req.session.oauth.access_token_secret = oauth_access_token_secret;
							req.session.oauth.request_token_used = true;
							console.log( util.inspect( results ) );
							oauthResults = results;
							res.render( 'index.html' );
						}
					});
				}
			} 
			else {
				console.log('4');
				res.render( 'index.html' );
			}
		})
		.get( '/auth/twitter', function( req, res ){
			var userHandle = req.query.screen_name;
			oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if (error) {
					console.log(error);
					res.render( 'index.html' );
				}
				else {
					req.session.oauth = {};
					req.session.oauth.token = oauth_token;
					req.session.oauth.token_secret = oauth_token_secret;
					req.session.oauth.request_token_used = false;
					res.redirect( 'https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token + '&screen_name=' + userHandle  );
			}
			});
		})
		.get( '/logout', function( req, res ){
			req.session.oauth = false;
			res.redirect('/');
		})
		.get( '/auth/twitter/tweet', function( req, res ){
			var oauth_access_token = req.session.oauth.access_token,
				oauth_access_token_secret = req.session.oauth.access_token_secret,
				twitterStatus = req.query.status;
			console.log(oauth_access_token); 
			console.log(oauth_access_token_secret);
			console.log(twitterStatus); 
			oa.post(
			  'https://api.twitter.com/1/statuses/update.json',
			  oauth_access_token, oauth_access_token_secret,
			  { 'status': twitterStatus },
			  function(error, data) {
			    if(error){
			    	console.log(require('sys').inspect(error));
			    } 
			    else{
			    	console.log(data);
			    	res.redirect('/');
			    } 
			  }
			);
		});

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	// Set up Socket.IO to listen on port 8000
	//socket = io.listen(server);

	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set( 'transports', [ 'websocket' ] );

		// Restrict log output
		socket.set( 'log level', 2 );
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on( 'connection', onSocketConnection );
};

// New socket connection
function onSocketConnection(client) {
	util.log( 'New player has connected: '+client.id );

	// Listen for client disconnected
	client.on( 'disconnect', onClientDisconnect );

	// Listen for new player message
	client.on( 'new player', onNewPlayer );

	// Listen for move player message
	client.on( 'move player', onMovePlayer );

	// Listen for Mongo Data request
	client.on( 'db data request', onDBDataRequest );
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log( 'Player has disconnected: ' + this.id);

	var removePlayer = playerById( this.id );

	// Player not found
	if (!removePlayer) {
		util.log( 'Player not found: ' + this.id );
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit( 'remove player', { id: this.id } );
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player( data.x, data.y );
	newPlayer.id = this.id;
	newPlayer.handle = data.handle;
	newPlayer.img = data.img;

	// Broadcast new player to connected socket clients
	this.broadcast.emit( 'new player', { 
		id: newPlayer.id, 
		x: newPlayer.getX(), 
		y: newPlayer.getY(), 
		handle: newPlayer.handle, 
		img: newPlayer.img });

	// Send existing players to the new player
	var i, existingPlayer;
	for ( i = 0; i < players.length; i++ ) {
		existingPlayer = players[i];
		this.emit( 'new player', { 
			id: existingPlayer.id, 
			x: existingPlayer.getX(), 
			y: existingPlayer.getY(), 
			handle: existingPlayer.handle, 
			img: existingPlayer.img });
	};
		
	// Add new player to the players array
	players.push( newPlayer );
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById( this.id );

	// Player not found
	if (!movePlayer) {
		util.log( 'Player not found: ' + this.id );
		return;
	};

	// Update player position
	movePlayer.setX( data.x );
	movePlayer.setY( data.y );

	// Broadcast updated position to connected socket clients
	this.broadcast.emit( 'move player', { 
		id: movePlayer.id, 
		x: movePlayer.getX(), 
		y: movePlayer.getY(), 
		handle: movePlayer.handle, 
		img: movePlayer.img } );
};

// Mongo data requested
function onDBDataRequest() {
	var oauth = typeof oauthResults == 'undefined' || oauthResults === false ? false : true,
		results = oauth ? oauthResults : false;

	this.emit( 'db data returned', { 
		users: dbUsers, 
		oauth: oauth, 
		results: results } );
	
	oauthResults = false;

	// Send existing players to the new player
	var i, existingPlayer;
	for ( i = 0; i < players.length; i++ ) {
		existingPlayer = players[i];
		this.emit( 'new player', { 
			id: existingPlayer.id, 
			x: existingPlayer.getX(), 
			y: existingPlayer.getY(), 
			handle: existingPlayer.handle, 
			img: existingPlayer.img } );
	};

	this.emit( 'new tweet', { tweet: lastTweet } );
};

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for ( i = 0; i < players.length; i++ ) {
		if ( players[i].id == id )
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
	init();