/**************************************************
** GAME PLAYER CLASS
**************************************************/
define( ['underscore'],
	function( _ ){

	var ReturnCharacter = ( function(){

		// private class level variables (used by all
		// characters )
		var defaultOptions = {
				// make no opts/assumptions right now,
				// let all opts be passed in by constructor
				// callee
			},
			CHANGE_DIRECTION = {
				SEED : 100,
				MULTIPLE: 100
			};

		// OmahaCharacter: create a new character for the canvas
		// opts:
		//		$canvas: canvas element as jQuery obj to draw on
		//		twitterHandle: twitter handle
		//		characterId: id to use to easily find character
		//		imageUri: location of actual 8 bit to draw
		var OmahaCharacter = function( opts ) {
			// instance vars
			var s = this,
				instanceOpts = _.extend( {}, defaultOptions, opts );

			_.each( instanceOpts, function( val, key ){
				s[key] = val;
			});

			// create the underlying image
			this.img = new Image();
			this.img.src = this.imgUri;

			// create initial position psuedo-randomly
			// todo: take out hard coded image height and width,
			// replace with lookups
			this.x = Math.random() * ( this.$canvas.width() - 40 );
			this.y = Math.random() * ( this.$canvas.height() - 80);

			// counters and other instance params for movements
			this.velocityX = 0;
			this.velocityY = 0;
			this.movementCounter = 0;
			this.countsUntilChange = 0;

		};

		OmahaCharacter.prototype = {
			getX : function() {
				return this.x;
			},
			getY : function() {
				return this.y;
			},
			setX : function( newX ) {
				this.x = newX;
			},
			setY : function( newY ) {
				this.y = newY;
			},
			newpath: function(){
				this.sev = Math.floor( Math.random() * -100 );

				this.countsUntilChange = Math.floor( CHANGE_DIRECTION.SEED +
					Math.random() * CHANGE_DIRECTION.MULTIPLE );

				// choose random velocity amount
				this.velocityX =  Math.random() * 2 - 1;
				this.velocityY = Math.random() * 2 - 1;
			},
	 		update : function( ctx ) {
				var prevX = this.x,
					prevY = this.y,
					imgHeight = this.img.height,
					imgWidth = this.img.width,
					sev = 0,
					newsev = [ 1, -1, 2, -2, 0, 0, 1, -1, 2, -2 ],
					h = this.$canvas.height() - imgHeight * 1.5, 
					w = this.$canvas.width() - imgWidth * 1.5,
					dir = 0,
					vb, hb, dy, dx, curr;
					
				this.movementCounter++;
				if ( this.movementCounter >= this.countsUntilChange ){
					this.newpath();
					this.movementCounter = 0;
				}

				curr = dir += sev;

				// calculate variance in per move velocity
				//dy = velocityX;// * ( 1 + Math.sin( curr * Math.PI / 180 ) );
				//dx = velocityY;// * ( 1 + Math.cos( curr * Math.PI / 180 ) );
				this.y += this.velocityY;
				this.x += this.velocityX;// + Math.round( Math.random() ) * 2 - 1;

				//horizontal-vertical bounce.
				vb = 180 - dir;
				hb = 0 - dir;
				// //Corner rebounds?
				// if (( y < 1 ) && ( x < 1 )){
				// 	y = 1;
				// 	x = 1;
				// 	this.velocityX =  Math.random() * 2 + 2;
				// 	this.velocityY = Math.random() * 2 + 2;			
				// 	dir = 45;
				// }
				// if (( y < 1 ) && ( x > w )){
				// 	y = 1;
				// 	x = w;
				// 	dir = 135;
				// }
				// if (( y > h ) && ( x < 1 )){
				// 	y = h; x = 1; dir = 315; }
				// if (( y > h ) && ( x > w )){ y = h; x = w; dir = 225; }
				// //edge rebounds.
				// if ( y < 1 ) {y = 1; dir = hb;}  
				// if ( y > h ) {y = h; dir = hb;}  
				// if ( x < 1 ) {x = 1; dir = Math.random() > .7 ? 180 : 0;} 
				// if ( x > w ) {x = w; dir = Math.random() > .3 ? 180 : 0;} 

				return ( prevX !== this.x || prevY !== this.y ) ? true : false;
			},
			draw : function( drawingCtx ) {
			    drawingCtx.drawImage( this.img,
			    	this.x,
			    	this.y,
			    	this.img.width * 1.5,
			    	this.img.height * 1.5 );
			}
		};

		return OmahaCharacter;
	})();

	return ReturnCharacter;

});
// var Omaha = function( startX, startY ) {
// 	var x = startX,
// 		y = startY,
// 		CHANGE_DIRECTION = {
// 			SEED : 300,
// 			MULTIPLE : 1000
// 		},
// 		counter1 = 0,
// 		counter2 = 0,
// 		dir = Math.random() > .3 ? 180 : 0,
// 		velocityX =  Math.random() * 2 - 1;
// 		velocityY = Math.random() * 2 - 1;
	
// 	// Getters and setters
// 	var getX = function() {
// 		return x;
// 	};

// 	var getY = function() {
// 		return y;
// 	};

// 	var setX = function( newX ) {
// 		x = newX;
// 	};

// 	var setY = function( newY ) {
// 		y = newY;
// 	};

// 	function newpath(){
// 		this.sev = Math.floor( Math.random() * -100 );

// 		this.counter2 = Math.floor( CHANGE_DIRECTION.SEED +
// 			Math.random() * CHANGE_DIRECTION.MULTIPLE );

// 		// choose random velocity amount
// 		this.velocityX =  Math.random() * 2 - 1;
// 		this.velocityY = Math.random() * 2 - 1;
// 	}

// 	// Update player position
// 	var update = function( ctx ) {
// 		var prevX = x,
// 			prevY = y,
// 			imgHeight = this.img.height,  
// 			imgWidth = this.img.width,  
// 			sev = 0,
// 			newsev = [ 1, -1, 2, -2, 0, 0, 1, -1, 2, -2 ],
// 			h = $('#street').height() - imgHeight * 1.5, 
// 			w = $('#street').width() - imgWidth * 1.5,
// 			vb, hb, dy, dx, curr;
			


// 		counter1++;
// 		if ( counter1 >= counter2 ){
// 			newpath();
// 			counter1 = 0;
// 		}

// 		curr = dir += sev;

// 		// calculate variance in per move velocity
// 		//dy = velocityX;// * ( 1 + Math.sin( curr * Math.PI / 180 ) );
// 		//dx = velocityY;// * ( 1 + Math.cos( curr * Math.PI / 180 ) );
// 		y += velocityY;
// 		x += velocityX;// + Math.round( Math.random() ) * 2 - 1;

// 		//horizontal-vertical bounce.
// 		vb = 180 - dir;
// 		hb = 0 - dir;
// 		//Corner rebounds?
// 		if (( y < 1 ) && ( x < 1 )){
// 			y = 1;
// 			x = 1;
// 			this.velocityX =  Math.random() * 2 + 2;
// 			this.velocityY = Math.random() * 2 + 2;			
// 			dir = 45;
// 		}
// 		if (( y < 1 ) && ( x > w )){
// 			y = 1;
// 			x = w;
// 			dir = 135;
// 		}
// 		if (( y > h ) && ( x < 1 )){
// 			y = h; x = 1; dir = 315; }
// 		if (( y > h ) && ( x > w )){ y = h; x = w; dir = 225; }
// 		//edge rebounds.
// 		if ( y < 1 ) {y = 1; dir = hb;}  
// 		if ( y > h ) {y = h; dir = hb;}  
// 		if ( x < 1 ) {x = 1; dir = Math.random() > .7 ? 180 : 0;} 
// 		if ( x > w ) {x = w; dir = Math.random() > .3 ? 180 : 0;} 

// 		return ( prevX != x || prevY != y ) ? true : false;
// 	};

// 	// Draw player
// 	var draw = function( ctx ) {
// 	    ctx.drawImage( this.img, x, y, this.img.width * 1.5, this.img.height * 1.5 );
// 	};

// 	// Define which variables and methods can be accessed
// 	return {
// 		getX: getX,
// 		getY: getY,
// 		setX: setX,
// 		setY: setY,
// 		update: update,
// 		draw: draw
// 	}
// };