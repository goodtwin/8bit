/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var express = require('express'),
	app = express(),
    server = require('http').createServer(app),
    MongoClient = require('mongodb').MongoClient,
    template  = require('swig'),
    tmpl = template.compileFile('/views'),
  	util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class

	server.listen(8000);

	app.use(express.static(__dirname + '/public'));

	//app.set('views', __dirname + '/views');
	// app.set('view engine', 'jade');

	// app.get('/', function (req, res) {
	//   res.sendfile(__dirname);
	// });

	// Connect to the db
	var databaseUrl = "8bits"; // "username:password@example.com/mydb"
	var collections = ["users"]
	var db = require("mongojs").connect(databaseUrl, collections);
	// db.users.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
	//   if( err || !saved ) console.log("User not saved");
	//   else console.log("User saved");
	// });
	// db.users.update({email: "srirangan@gmail.com"}, {$set: {password: "iReallyLoveMongo"}}, function(err, updated) {
	//   if( err || !updated ) console.log("User not updated");
	//   else console.log("User updated");
	// });
	// db.users.find(function(err, users) {
	// 	if( err || !users ) console.log("User not saved");
	//     else users.forEach( function(user) {
 //    		console.log(user);
 //    	});
	// });
	app.get('/', function(req, res) {
	  //var fields = { subject: 1, body: 1, tags: 1, created: 1, author: 1 };
	  db.users.find(function(err, users) {
		  if( err || !users ) console.log("User not saved");
	      //res.sendfile(__dirname + '/views');
	      users.forEach( function(user) {
    		console.log(user);
			});
	      tmpl.render({
		    pagename: 'awesome people',
		    authors: ['Paul', 'Jim', 'Jane']
		  });
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

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
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
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
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