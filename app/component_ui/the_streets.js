'use strict';

define(

  [
    'components/flight/lib/component',
    '/socket.io/socket.io.js'
  ],

  function(defineComponent) {

    return defineComponent(theStreets);

    function theStreets() {

      var ctx,      // Canvas rendering context
          keys,     // Keyboard input
          omahaPlayers,   // 'Static' players
          localPlayer,  // Local player
          remotePlayers,  // Remote players
          socket,     // Socket connection
          startX,
          startY,
          that;

      this.defaultAttrs({
        canvasSelector : '#street'
      });

      this.showCanvas = function( e, data ){
        this.$node.html( data.markup );
        // Declare rendering context
        ctx = this.select('canvasSelector')[0].getContext("2d");

        // Set canvas size
        this.select('canvasSelector').attr('width', window.innerWidth);
        this.select('canvasSelector').attr('height', 390);

        this.trigger('canvasShown', { oauth: data.oauth, results: data.results });
      }

      this.initializeGame = function(e, data){
        // Initialise keyboard controls
        keys = new Keys();

        startX = Math.round(Math.random()*(this.select('canvasSelector').attr('width')-40)),
        startY = Math.round(Math.random()*(this.select('canvasSelector').attr('height')-80));

        // Initialise Omaha
        this.trigger('eightBitsRequested', { oauth: data.oauth, results: data.results });
        
        // if( data.results.screen_name ){
        //   this.trigger('localPlayerRequested', { oauth: data.oauth, results: data.results });
        // }
        // Initialise the local player
        //localPlayer = new Player(startX, startY);
        //localPlayer.img = new Image();
        //localPlayer.img.src = 

        // Initialise socket connection
        socket = io.connect("http://localhost");

        // Initialise remote players array
        remotePlayers = [];

        this.trigger('gameInitialized');
      }

      this.animateFrame = function(){
        that.trigger('update');
        that.trigger('draw');
        // Request a new animation frame using Paul Irish's shim
        window.requestAnimFrame(that.animateFrame);
      }

      this.update = function(){
        // Update local player and check for change
        // if (localPlayer.update(keys)) {
        //   // Send local player data to the game server
        //   socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
        // };

        // Update the Omaha players position
        var i;
        for (i = 0; i < omahaPlayers.length; i++) {
          omahaPlayers[i].update(ctx);
        };
      }

      this.draw = function() {
        // Wipe the canvas clean
        ctx.clearRect(0, 0, this.select('canvasSelector').width(), this.select('canvasSelector').height());

        // Draw the Omaha players
        var i;
        for (i = 0; i < omahaPlayers.length; i++) {
          omahaPlayers[i].draw(ctx);
        };

        // Draw the remote players
        var i;
        for (i = 0; i < remotePlayers.length; i++) {
          remotePlayers[i].draw(ctx);
        };

        // Draw the local player
        //localPlayer.draw(ctx);
      }

      // Keyboard key down
      this.onKeydown = function(e) {
        if (localPlayer) {
          keys.onKeyDown(e);
        };
      };

      // Keyboard key up
      this.onKeyup = function(e) {
        if (localPlayer) {
          keys.onKeyUp(e);
        };
      };

      // Browser window resize
      this.onResize = function(e) {
        // Maximise the canvas
        this.select('canvasSelector').attr('width', window.innerWidth);
      };

      // Socket connected
      this.onSocketConnected = function() {
        socket = io.connect("http://localhost");
        console.log("Connected to socket server");

        // Initialise the local player
        //localPlayer = new Player(startX, startY);
        //localPlayer.img = new Image();
        //localPlayer.img.src = 
        //that.trigger('socketConnected');
        // Send local player data to the game server
        //socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
      };

      // Socket disconnected
      this.onSocketDisconnect = function() {
        console.log("Disconnected from socket server");
      };

      // New player
      this.onNewPlayer = function(data) {
        console.log("New player connected: "+data.id);

        // Initialise the new player
        var newPlayer = new Player(data.x, data.y);
        newPlayer.id = data.id;

        // Add new player to the remote players array
        remotePlayers.push(newPlayer);
      };

      // Move player
      this.onMovePlayer = function(data) {
        var movePlayer = playerById(data.id);

        // Player not found
        if (!movePlayer) {
          console.log("Player not found: "+data.id);
          return;
        };

        // Update player position
        movePlayer.setX(data.x);
        movePlayer.setY(data.y);
      };

      // Remove player
      this.onRemovePlayer = function(data) {
        var removePlayer = playerById(data.id);

        // Player not found
        if (!removePlayer) {
          console.log("Player not found: "+data.id);
          return;
        };

        // Remove player from array
        remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
      };

      this.playerById = function(id) {
        var i;
        for (i = 0; i < remotePlayers.length; i++) {
          if (remotePlayers[i].id == id)
            return remotePlayers[i];
        };
        
        return false;
      };

      this.createOmahaPlayers = function(e, data){
        omahaPlayers = [];
        for (var i = 0; i < data.users.length; i++) {
          var startX = Math.round(Math.random()*(that.select('canvasSelector').attr('width')-40)),
              startY = Math.round(Math.random()*(that.select('canvasSelector').attr('height')-80)),
              id = (data.users[i].first_name+'-'+data.users[i].last_name).replace(/\s/g, ''),
              imgUri = $('.-bit_'+id).css('background-image').replace('url(','').replace(')','');
          
          var newPlayer = new Omaha(startX, startY);
              newPlayer.id = id;
              newPlayer.currX = startX;
              newPlayer.currY = startY;
              newPlayer.img = new Image();
              newPlayer.img.src = imgUri;

          // Add new player to the Omaha players array
          omahaPlayers.push(newPlayer);
        };
          //this.trigger('omahaPlayersCreated', { omahaPlayers: omahaPlayers });
      };

      this.createlocalPlayer = function(e, data) {
        console.log(data);
      };

      this.after('initialize', function() {
        that = this;
        this.on( document, 'theStreetsServed', this.showCanvas );
        this.on( document, 'canvasShown', this.initializeGame);
        this.on( document, 'gameInitialized', this.animateFrame);
        this.on( document, 'eightBitsServed', this.createOmahaPlayers);
        //this.on( document, 'oauthServed', this.createlocalPlayer);
        

        this.on( document, 'update', this.update);
        this.on( document, 'draw', this.draw);
        this.on( document, 'keydown', this.onKeydown);
        this.on( document, 'keyup', this.onKeyup);
        this.on( window, 'resize', this.onResize);


        var socket = io.connect("http://localhost");
        // Socket connection successful
        socket.on("connect", this.onSocketConnected);

        // Socket disconnection
        socket.on("disconnect", this.onSocketDisconnect);

        // New player message received
        socket.on("new player", this.onNewPlayer);

        // Player move message received
        socket.on("move player", this.onMovePlayer);

        // Player removed message received
        socket.on("remove player", this.onRemovePlayer);
      });
    }
  }
);
