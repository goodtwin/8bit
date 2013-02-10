/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var express = require('express'),
	app = express(),
	cons = require('consolidate'),
    swig = require('swig'),
    http = require('http'),
    server = http.createServer(app),
    MongoClient = require('mongodb').MongoClient,
    mongojs = require("mongojs"),
    OAuth= require('oauth').OAuth,
  	util = require('util'),					
	io = require('socket.io'),				
	Player = require('./Player').Player;	

	server.listen(8000);

	// Mongo
	var databaseUrl = '8bit', // "username:password@example.com/mydb"
		collections = ['users'],
		db = mongojs.connect(databaseUrl, collections),
		dbUsers,
		dbTwitterIds = [];
	
	db.users.find(function(err, users) {
		if( err || !users ) console.log('User not saved');
		else dbUsers = users;
		beginTwitterStream();
	});
	
	// Twitter
	var oa = new OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		'8YVoUbVLwaWmoxLgPk5nqg',
		'rlj9GEYPY5Lo07odlib4MgRiIl0T2Au7B2O6d2gfFc',
		'1.0',
		'http://localhost:8000/',
		'HMAC-SHA1'
	);

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
		request.addListener( 'response', function(response) {
		  response.setEncoding( 'utf8' );
		  response.addListener( 'data', onNewTweet );
		  	//if(socket){
		    	//console.log(chunk);
		    	//this.emit( 'new tweet', { tweet: chunk } );
		    //} 
		  //});
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
				req.session.oauth.verifier = req.query.oauth_verifier;
				console.log(req.session.oauth);
				var oauth = req.session.oauth;

				oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
				function(error, oauth_access_token, oauth_access_token_secret, results){			
					if (error){
						console.log(error);
						res.render( 'index.html' );
					} else {
						req.session.oauth.access_token = oauth_access_token;
						req.session.oauth.access_token_secret = oauth_access_token_secret;
						console.log(req.session.oauth);
						Results = results;
						res.render( 'index.html' );
					}
				}
				);
			} else
				res.render( 'index.html' );
		})
		.get( '/auth/twitter', function( req, res ){
			//console.log(req.session.oauth),
			oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if (error) {
					console.log(error);
					//res.send( 'yeah no. didn\'t work.')
					res.render( 'index.html' );
				}
				else {
					req.session.oauth = {};
					req.session.oauth.token = oauth_token;
					req.session.oauth.token_secret = oauth_token_secret;
					res.redirect( 'https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token )
			}
			});
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
	socket = io.listen(server);

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

	// Listen for Oauth request
	client.on( 'lookingForOauth', onOauthRequest );

	//client.on( 'lookingForTweets', onTweetsRequest );
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log('Player has disconnected: '+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log( 'Player not found: '+this.id );
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
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById( this.id );

	// Player not found
	if (!movePlayer) {
		util.log( 'Player not found: '+this.id );
		return;
	};

	// Update player position
	movePlayer.setX( data.x );
	movePlayer.setY( data.y );

	// Broadcast updated position to connected socket clients
	this.broadcast.emit('move player', { 
		id: movePlayer.id, 
		x: movePlayer.getX(), 
		y: movePlayer.getY(), 
		handle: movePlayer.handle, 
		img: movePlayer.img } );
};

// Oauth state requested
function onOauthRequest() {
	var oauth = typeof Results == 'undefined' || Results === false ? false : true,
		results = oauth ? Results : false;
	
	this.emit( 'db data returned', { 
		users: dbUsers, 
		oauth: oauth, 
		results: results } );
	Results = false;

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
};

// Send new Tweet
function onNewTweet( data ) {
	console.log(data);
	this.emit( 'new tweet', { tweet: data } );
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