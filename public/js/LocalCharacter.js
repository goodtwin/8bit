/**************************************************
** LOCAL PLAYER CLASS
**************************************************/
define( ['underscore'],
	function( _ ){

	var ReturnLocalCharacter = ( function(){

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

		// LocalCharacter: create a new local character for the canvas
		// opts:
		//		$canvas: canvas element as jQuery obj to draw on
		//		twitterHandle: twitter handle
		//		characterId: id to use to easily find character
		//		imageUri: location of actual 8 bit to draw
		var LocalCharacter = function( opts ) {
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

			// create cursor image
			this.cursor = new Image();
			this.cursor.src = 'public/img/pointer.svg';

		};

		LocalCharacter.prototype = {
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

	 		update : function( keys ) {
				// Previous position
				var prevX = this.x,
					prevY = this.y,
					dy = 4,
					dx = 4;

				// Up key takes priority over down
				if (keys.up) {
					this.y = this.y - dy > 0 ? this.y - dy : prevY;
				} else if (keys.down) {
					this.y = this.y + dy < $('#street').height()-80 ? this.y + dy : prevY;
				};

				// Left key takes priority over right
				if (keys.left) {
					this.x = this.x - dx > 0 ? this.x - dx : prevX;
				} else if (keys.right) {
					this.x = this.x + dx < $('#street').width()-50 ? this.x + dx : prevX;
				};

				return (prevX != this.x || prevY != this.y) ? true : false;
			},

			draw : function( drawingCtx ) {
				var ex = this.x + this.img.width,
		    	ey = this.y + this.img.height * 1.9,
		    	height = 20,
		    	width = 60,
		    	grd = drawingCtx.createRadialGradient(ex,ey,12,ex,ey,35);
			    grd.addColorStop(0, "rgba(50, 50, 50, 0.3)");
			    grd.addColorStop(1, "rgba(250, 250, 250, 0.1)");
			    drawingCtx.beginPath();
				    drawingCtx.moveTo(ex - width /2 , ey); // A1
				    drawingCtx.bezierCurveTo(
				      ex - width / 2, ey - height / 2, // C1
				      ex + width / 2, ey - height / 2, // C2
				      ex + width / 2, ey ); // A2
				    drawingCtx.bezierCurveTo(
				      ex + width / 2, ey + height / 2, // C3
				      ex - width / 2, ey + height / 2, // C4
				      ex - width / 2, ey ); // A1		 
				    drawingCtx.fillStyle = grd;
				    drawingCtx.fill();
			    drawingCtx.closePath();
			    drawingCtx.drawImage(this.cursor, this.x + 15, this.y - 40, this.img.width, this.img.height);
			    drawingCtx.drawImage(this.img, this.x, this.y, this.img.width*2, this.img.height*2);
			}
		};

		return LocalCharacter;
	})();

	return ReturnLocalCharacter;

});