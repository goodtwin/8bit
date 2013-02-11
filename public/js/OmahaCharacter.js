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
			this.x = Math.random() * ( this.$canvas.width() - 40 );
			this.y = Math.random() * ( this.$canvas.height() - 80);

			// counters and other instance params for movements
			this.changeX = 0;
			this.changeY = 0;
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
				this.countsUntilChange = Math.floor( CHANGE_DIRECTION.SEED +
					Math.random() * CHANGE_DIRECTION.MULTIPLE );

				// choose random velocity amount
				this.changeX =  Math.random() * 2 - 1;
				this.changeY = Math.random() * 2 - 1;
			},
	 		update : function( ctx ) {
				var prevX = this.x,
					prevY = this.y,
					h = this.$canvas.height() - (this.img.height * 1.6), 
					w = this.$canvas.width() - (this.img.width * 1.6);
					
				this.movementCounter++;
				if ( this.movementCounter >= this.countsUntilChange ){
					this.newpath();
					this.movementCounter = 0;
				}

				// calculate variance in per move velocity
				this.y += this.changeY;
				this.x += this.changeX;

				this.validateDX( w );
				this.validateDY( h );

				return ( prevX !== this.x || prevY !== this.y ) ? true : false;
			},

			validateDY : function( h ) {
				if ( this.y < 1 ){
					this.changeY = Math.random();
				} 
				else if( this.y > h ) {
					this.changeY = Math.random() * -1;
				}
			},

			validateDX : function( w ) {
				if ( this.x < 1 ){
					this.changeX = Math.random();
				} 
				else if( this.x > w ) {
					this.changeX = Math.random() * -1;
				}
			},

			draw : function( drawingCtx ) {
				var ellipseX = this.x + this.img.width / 1.5,
			    	ellipseY = this.y + this.img.height * 1.4,
			    	ellipseHeight = 15,
			    	ellipseWidth = 50,
			    	ellipseGradient = drawingCtx.createRadialGradient(ellipseX,ellipseY,9,ellipseX,ellipseY,30);
				    ellipseGradient.addColorStop(0, "rgba(50, 50, 50, 0.3)");
				    ellipseGradient.addColorStop(1, "rgba(250, 250, 250, 0.1)");
			    drawingCtx.beginPath();
				    drawingCtx.moveTo(ellipseX - ellipseWidth / 2, ellipseY); // A1
				    drawingCtx.bezierCurveTo(
						ellipseX - ellipseWidth / 2, ellipseY - ellipseHeight / 2, // C1
						ellipseX + ellipseWidth / 2, ellipseY - ellipseHeight / 2, // C2
						ellipseX + ellipseWidth / 2, ellipseY ); // A2
				    drawingCtx.bezierCurveTo(
						ellipseX + ellipseWidth / 2, ellipseY + ellipseHeight / 2, // C3
						ellipseX - ellipseWidth / 2, ellipseY + ellipseHeight / 2, // C4
						ellipseX - ellipseWidth / 2, ellipseY ); // A1		 
				    drawingCtx.fillStyle = ellipseGradient;
				    drawingCtx.fill();
			    drawingCtx.closePath();
			    drawingCtx.drawImage( this.img,
			    	this.x,
			    	this.y,
			    	this.img.width * 1.5,
			    	this.img.height * 1.5 );
			}

			// speak : function( tweet, drawingCtx ) {
			// 	return typeof tweet.user.screen_name == "undefined" ? false : true;
			// 	//console.log( tweet.user.screen_name + ': ' + tweet.text );
			// }
		};

		return OmahaCharacter;
	})();

	return ReturnCharacter;

});