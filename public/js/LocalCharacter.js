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
			this.x = this.startX || Math.random() * ( this.$canvas.width() - 40 );
			this.y = this.startY || Math.random() * ( this.$canvas.height() - 180 ) + 100;

			this.lastX = this.x;
			this.lastY = this.y;

			// create cursor image
			this.cursor = new Image();
			this.cursor.src = 'public/img/pointer.svg';

			this.delta = {},
			this.latest = {
				x: 0,
				y: 0
			},
			this.loopCount = 0,
			this.numberMoves = 0,
			this.currMoves = 0;
			this.LOOP_MULTIPLIER = 2; //
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
			getLastX : function() {
				return this.lastX;
			},
			getLastY : function() {
				return this.lastY;
			},
			setLastX : function( lastX ) {
				this.lastX = lastX;
			},
			setLastY : function( lastY ) {
				this.lastY = lastY;
			},

			update : function( keys ) {
				// Previous position
				var prevX = this.x,
					prevY = this.y,
					dy = 4,
					dx = 4;

				// Up key takes priority over down
				if (keys.up) {
					this.y = this.y - dy > 100 ? this.y - dy : prevY;
				} else if (keys.down) {
					this.y = this.y + dy < $('#street').height()-80 ? this.y + dy : prevY;
				}

				// Left key takes priority over right
				if (keys.left) {
					this.x = this.x - dx > 0 ? this.x - dx : prevX;
				} else if (keys.right) {
					this.x = this.x + dx < $('#street').width()-50 ? this.x + dx : prevX;
				}

				return (prevX != this.x || prevY != this.y) ? true : false;
			},

			draw : function( drawingCtx, dx, dy ) {
				dx = typeof dx !== 'undefined' ? dx : this.x;
				dy = typeof dy !== 'undefined' ? dy : this.y;
				var ex = dx + this.img.width /1.5,
					ey = dy + this.img.height * 1.4,
					height = 15,
					width = 50,
					grd = drawingCtx.createRadialGradient(ex,ey,9,ex,ey,30);
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
				drawingCtx.drawImage(this.cursor, dx, dy - 40, this.img.width, this.img.height);
				drawingCtx.drawImage(this.img, dx, dy, this.img.width*1.5, this.img.height*1.5);
			},
			//
			queue: function( x, y ){
				var s = this;
				var newPos = {
					x: Math.round(x),
					y: Math.round(y)
				};

				if( s.latest.x === newPos.x && s.latest.y === newPos.y ){
					s.numberMoves = 0;
				} else {

					_.each( [ "x", "y" ], function( pos ){
						s.delta[pos] = newPos[pos] - s.latest[pos];
					});

					s.numberMoves = s.currMoves = (s.LOOP_MULTIPLIER * s.loopCount);
				}
				s.loopCount = 0;
			},
			coords: function(){
				var s = this;

				s.loopCount++;

				if( s.currMoves ){
					_.each( [ "x", "y" ], function( pos ){
						s.latest[pos] += Math.round(s.delta[pos] / s.numberMoves);
					});
					s.currMoves--;
				}
				return s.latest;
			}

		};

		return LocalCharacter;
	})();

	return ReturnLocalCharacter;

});