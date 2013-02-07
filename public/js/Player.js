/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		dy= 4 , 
		dx = 4,
		shadow = new Image();
		shadow.src = 'public/img/bit_shadows.svg';
	
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
			y = y + dy < $('#street').height()-80 ? y + dy : prevY;
		};

		// Left key takes priority over right
		if (keys.left) {
			x = x - dx > 0 ? x - dx : prevX;
		} else if (keys.right) {
			x = x + dx < $('#street').width()-50 ? x + dx : prevX;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		// if (typeof this.img == "undefined") {
		// 	this.img = new Image();
		// 	this.img.src = $('.-bit_andrew-wirick').css('background-image').replace('url(','').replace(')','');
		// }
	    var ex = x+this.img.width,
	    	ey = y+this.img.height*1.9,
	    	height = 20,
	    	width = 60,
	    	grd = ctx.createRadialGradient(ex,ey,12,ex,ey,35);
		    grd.addColorStop(0, "rgba(50, 50, 50, 0.3)");
		    grd.addColorStop(1, "rgba(250, 250, 250, 0.1)");
	    ctx.beginPath();
		    ctx.moveTo(ex - width/2, ey); // A1
		    ctx.bezierCurveTo(
		      ex - width/2, ey - height/2, // C1
		      ex + width/2, ey - height/2, // C2
		      ex + width/2, ey ); // A2
		    ctx.bezierCurveTo(
		      ex + width/2, ey + height/2, // C3
		      ex - width/2, ey + height/2, // C4
		      ex - width/2, ey ); // A1		 
		    ctx.fillStyle = grd;
		    ctx.fill();
	    ctx.closePath();
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