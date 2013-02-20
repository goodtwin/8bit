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
	fs = require( 'fs' ),
	nodemailer = require("nodemailer"),
	socket = io.listen(server),
	appconfig = require("./appconfig.js"),
	Player = require( './Player' ).Player;

server.listen(8000);

// Mongo
var databaseUrl = '8bit', // "username:password@example.com/mydb"
	collections = ['users'],
	db = mongojs.connect(databaseUrl, collections),
	omahaPeople,
	dbTwitterIds = [];

db.users.find(function(err, users) {
	if( err || !users ) console.log( 'User not saved' );
	else omahaPeople = users;
	beginTwitterStream();
});

// Twitter
var oa = new OAuth(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	'8YVoUbVLwaWmoxLgPk5nqg',
	'rlj9GEYPY5Lo07odlib4MgRiIl0T2Au7B2O6d2gfFc',
	'1.0A',
	'http://' + appconfig.baseuri +  ':8000/i',
	'HMAC-SHA1'
);

var lastTweet;

function beginTwitterStream() {
	for (var i = 0; i < omahaPeople.length; i++) {
		dbTwitterIds.push( omahaPeople[i].twitter_id );
	}
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
			}
		});
		response.addListener( 'end', function () {
			console.log( '--- END ---' );
		});
	});
	request.end();
}

//NodeMailer
var smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
				user: "support@good-twin.com",
				pass: "gflyingpig3"
		}
});

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

	.use( express["static"]( __dirname ) ) // static is reserved, will blow up linters
	
	.engine( '.html', cons.swig )
	
	.set( 'view engine', 'html' )
	
	.set( 'views', __dirname + '/views' )
	
	.get( '/', function( req, res ) {
		if (req.session.oauth) {
			res.redirect( '/auth/twitter' );
		}
		else {
			//console.log('4');
			res.render( 'index.html' );
		}
	})
	.get( '/i', function( req, res ) {
		if (req.session.oauth) {
			req.session.oauth.verifier = req.query.oauth_verifier;
			//console.log('1: '+ util.inspect( req.session.oauth ) );
			var oauth = req.session.oauth;
			
			if( oauth.request_token_used ){
				res.redirect( '/auth/twitter' );
			}
			else{
				oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier,
					function(error, oauth_access_token, oauth_access_token_secret, results){
						if (error){
							//console.log('2: '+ util.inspect( error ) );
							res.render( 'index.html' );
						} else {
							//console.log('3: '+ util.inspect( req.session.oauth ) );
							req.session.oauth.access_token = oauth_access_token;
							req.session.oauth.access_token_secret = oauth_access_token_secret;
							req.session.oauth.request_token_used = true;
							req.session.oauth.screen_name = results.screen_name;
							//console.log( util.inspect( results ) );
							//oauthResults = results;
							res.render( 'index.html' );
						}
					});
			}
		}
		else {
			//console.log('4');
			res.render( 'index.html' );
		}
	})
	.get( '/logout', function( req, res ){
		req.session.oauth = false;
		res.redirect('/');
	})

	.get( '/email', function( req, res ){

		var name = req.query.name,
			email = req.query.email,
			handle = req.query.handle,
			body = req.query.text;

		// setup e-mail data with unicode symbols
		var mailOptions = {
				from: name + '<' + email +'>', // sender address
				to: 'greg@good-twin.com', // list of receivers
				subject: "8-Bit Request Form", // Subject line
				text: body //, // plaintext body
				//html: "<b>Hello world ✔</b>" // html body
		};

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error, response){
				if(error){
						console.log(error);
				}else{
						console.log("Message sent: " + response.message);
						res.writeHead(200, {'content-type': 'text/json' });
					res.write( JSON.stringify({ test : 'email sent'}) );
					res.end('\n');
				}

				// if you don't want to use this transport object anymore, uncomment following line
				//smtpTransport.close(); // shut down the connection pool, no more messages
		});
	})
	// determines from session if the user has auth'd
	.get( '/auth/status', function( req ,res ){
		res.writeHead(200, {'content-type': 'text/json' });
		console.log( req.session.oauth );
		res.write( JSON.stringify( req.session.oauth ?
			req.session.oauth :
			null ));
		res.end('\n');
	})
	.get( '/auth/twitter', function( req, res ){
		console.log(req.query.screen_name);
		var userHandle = req.query.username || '';
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
	.get( '/auth/twitter/download/:id', function( req, res ){
		var id = req.params.id;
		res.download( __dirname + '/public/style/8bits/png/bit_' + id + '.png', id + '.png' );
	})
	.get( '/auth/twitter/tweet', function( req, res ){
		var oauth_access_token = req.session.oauth.access_token,
			oauth_access_token_secret = req.session.oauth.access_token_secret,
			twitterStatus = req.query.status;
		oa.post(
			'https://api.twitter.com/1/statuses/update.json',
			oauth_access_token, oauth_access_token_secret,
			{ 'status': twitterStatus },
			function(error, data) {
				if(error){
					console.log(require('sys').inspect(error));
				}
				else{
					socket.sockets.emit( 'new tweet', { tweet: data } );
					lastTweet = data;
					res.writeHead(200, {'content-type': 'text/json' });
					res.write( JSON.stringify({ test : 'tweet sent'}) );
					res.end('\n');
				}
			}
		);
	});

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	humanPlayers;	// Array of connected humanPlayers


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store humanPlayers
	humanPlayers = [];

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
}


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
}

// Socket client has disconnected
function onClientDisconnect() {
	util.log( 'Player has disconnected: ' + this.id);

	var removePlayer = playerById( this.id );

	// Player not found
	if (!removePlayer) {
		util.log( 'Player not found: ' + this.id );
		return;
	}

	// Remove player from humanPlayers array
	humanPlayers.splice(humanPlayers.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit( 'remove player', { id: this.id } );
}

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

	// Send existing humanPlayers to the new player
	// var i, existingPlayer;
	// for ( i = 0; i < humanPlayers.length; i++ ) {
	// 	existingPlayer = humanPlayers[i];
	// 	this.emit( 'new player', {
	// 		id: existingPlayer.id,
	// 		x: existingPlayer.getX(),
	// 		y: existingPlayer.getY(),
	// 		handle: existingPlayer.handle,
	// 		img: existingPlayer.img });
	// }
		
	// Add new player to the humanPlayers array
	humanPlayers.push( newPlayer );
}

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById( this.id );

	// Player not found
	if (!movePlayer) {
		util.log( 'Player not found: ' + this.id );
		return;
	}

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
}

// Mongo data requested
// Called within init, called from the client side.
function onDBDataRequest() {
	this.emit( 'db data returned', {
		users: omahaPeople });

	// Send array of current remote humanPlayers already authd
	// Send existing humanPlayers to the new player
	var i, existingPlayer;
	for ( i = 0; i < humanPlayers.length; i++ ) {
		existingPlayer = humanPlayers[i];
		this.emit( 'new player', {
			id: existingPlayer.id,
			x: existingPlayer.getX(),
			y: existingPlayer.getY(),
			handle: existingPlayer.handle,
			img: existingPlayer.img } );
	}

	this.emit( 'new tweet', { tweet: lastTweet } );
}

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for ( i = 0; i < humanPlayers.length; i++ ) {
		if ( humanPlayers[i].id == id )
			return humanPlayers[i];
	}
	
	return false;
}


/**************************************************
** RUN THE GAME
**************************************************/
init();