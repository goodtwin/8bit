/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Omaha = function(startX, startY) {
	var x = startX,
		y = startY,
		id;
	
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
			prevY = y,
			dx = Math.round(Math.random()*1),
			dy = Math.round(Math.random()*1),
			dir = (Math.round(Math.random()*1) * 2 - 1) == 1 ? true /*positive*/ : false /*negative*/;

		//Up key takes priority over down
		if (dir) {
			y = y + dy < canvas.height-80 ? y + dy : prevY;
		} else  {
			y = y - dy > 0 ? y - dy : prevY;
		};

		// Left key takes priority over right
		if (dir) {
			x = x + dx < canvas.width-50 ? x + dx : prevX;
		} else {
			x = x - dx > 0 ? x - dx : prevX;
		};

		//x = x - dx > 0 ? x + dx : prevX;
		//y = y - dy > 0 ? y + dy : prevY;

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
	    ctx.drawImage(this.img, x, y, this.img.width*2, this.img.height*2);
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