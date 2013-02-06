/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, canvas) {
	var x = startX,
		y = startY,
		id,
		dy= 4 , 
		dx = 4;
	
	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};
	
	var setImgSrc = function() {
		
	};

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y = y - dy > 0 ? y - dy : prevY;
		} else if (keys.down) {
			y = y + dy < canvas.height-80 ? y + dy : prevY;
		};

		// Left key takes priority over right
		if (keys.left) {
			x = x - dx > 0 ? x - dx : prevX;
		} else if (keys.right) {
			x = x + dx < canvas.width-50 ? x + dx : prevX;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		if (typeof this.img == "undefined") {
			this.img = new Image();
			this.img.src = $('.-bit_andrew-wirick').css('background-image').replace('url(','').replace(')','');
		}
	    ctx.drawImage(this.img, x, y, this.img.width*1.5, this.img.height*1.5);


	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw
	}
};