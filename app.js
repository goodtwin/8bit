/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var express = require('express'),
	app = express(),
	cons = require('consolidate'),
    swig = require('swig'),
    server = require('http').createServer(app),
    MongoClient = require('mongodb').MongoClient,
    mongojs = require("mongojs"),
    OAuth= require('oauth').OAuth,
    twitter = require('ntwitter'),
  	util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class

	server.listen(8000);

	// Connect to the db
	// var databaseUrl = "8bit"; // "username:password@example.com/mydb"
	// var collections = ["users"]
	// var db = mongojs.connect(databaseUrl, collections);
	// db.users.find(function(err, users) {
	// 	if( err || !users ) console.log("User not saved");
	// 	else /*users.forEach( function(user) {*/
	// 		//console.log(users);
	// 		//res.render('index.html', { users: users });
	// 		allUsers = users;
	// 	//});
	// });
	
	var oa = new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		"253hJFYT0ycsQdy1NEjp7Q",
		"KRnLaoNlmKaTTFSXJJ7zI6VXKnf0yEr8kr6klRtyiM0",
		"1.0",
		"http://localhost:8000/",
		"HMAC-SHA1"
	);

	var t = new twitter({
	    consumer_key: "253hJFYT0ycsQdy1NEjp7Q",
	    consumer_secret: "KRnLaoNlmKaTTFSXJJ7zI6VXKnf0yEr8kr6klRtyiM0",
	    access_token_key: "275539731-7Jqu2a53nNmcsvjWpIPWQsBBDwm8QtXJ7yPYzfI0",
	    access_token_secret: "i5zgbf68AJc7BAZuTzGbq9FJJO1XvxRjMydGtJlGY"
	});

	t.stream(
	    'statuses/filter',
	    { follow: ['7452872', '69147333']},
	    function(stream) {
	        stream.on('data', function(tweet) {
	            console.log(tweet);
	        });
	    }
	);

	swig.init({
		cache: false,
	    root: __dirname + '/views',
	    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
	});

	app
		.use( express.cookieParser() )

		.use( express.session( { secret: 'goodtwin' } ) )

		.use(express.static( __dirname ))
		
		.engine('.html', cons.swig)
		
		.set('view engine', 'html')
		
		.set('views', __dirname + '/views')
		
		.get('/', function(req, res) {
			if (req.session.oauth) {
				req.session.oauth.verifier = req.query.oauth_verifier;
				console.log(req.session.oauth);
				var oauth = req.session.oauth;

				oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
				function(error, oauth_access_token, oauth_access_token_secret, results){			
					if (error){
						console.log(error);
						res.render('index.html');
					} else {
						req.session.oauth.access_token = oauth_access_token;
						req.session.oauth.access_token_secret = oauth_access_token_secret;
						console.log(results);
						Results = results;
						res.render('index.html');
					}
				}
				);
			} else
				res.render('index.html');
		})
		.get('/auth/twitter', function(req, res){
			console.log(req.session.oauth),
			oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if (error) {
					console.log(error);
					res.send("yeah no. didn't work.")
				}
				else {
					req.session.oauth = {};
					req.session.oauth.token = oauth_token;
					req.session.oauth.token_secret = oauth_token_secret;
					res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
			}
			});
		})

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
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);

	// Listen for Oauth request
	client.on('lookingForOauth', onOauthRequest);
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	newPlayer.handle = data.handle;
	newPlayer.img = data.img;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), handle: newPlayer.handle, img: newPlayer.img});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), handle: existingPlayer.handle, img: existingPlayer.img});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), handle: movePlayer.handle, img: movePlayer.img});
};

// Oauth state requested
function onOauthRequest() {
	var oauth = typeof Results == "undefined" || Results === false ? false : true;
	var results = oauth ? Results : false;
	//console.log();
	this.emit("oauth returned", {oauth: oauth, results: results});
	Results = false;

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), handle: existingPlayer.handle, img: existingPlayer.img});
	};
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
	init();