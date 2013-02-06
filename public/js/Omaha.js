/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Omaha = function(startX, startY) {
	var x = startX,
		y = startY,
		c1 = 0,
		c2 = 0,
		dir = Math.random() > .3 ? 180 : 0,
		vel =  Math.random() < 0.5 ? .3 : .8;
	
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

	// Update player position
	var update = function(ctx) {
		var prevX = x,
			prevY = y,
			imgh = this.img.height,  
			imgw = this.img.width,  
			sev = 0,
			newsev = new Array(1,-1,2,-2,0,0,1,-1,2,-2),
			h = $('#street').height() - imgh*1.5, 
			w = $('#street').width() - imgw*1.5,
			vb,hb,dy,dx,curr;
			
		function newpath(){
			sev = Math.floor(Math.random()*-100);
			c2 = Math.floor(20+Math.random()*50);
			vel =  Math.random() < 0.5 ? .4 : 1;
		}

		c1++
		if (c1 >= c2){
		 newpath();
		 c1=0;
		}
		curr = dir+=sev;
		dy = vel * Math.sin(curr*Math.PI/180);
		dx = vel * Math.cos(curr*Math.PI/180);
		y+=dy;
		x+=dx+Math.round(Math.random()*1) * 2 - 1;

		//horizontal-vertical bounce.
		vb = 180-dir;
		hb = 0-dir;
		//Corner rebounds?
		if ((y < 1) && (x < 1)){y = 1; x = 1; dir = 45;}
		if ((y < 1) && (x > w)){y = 1; x = w; dir = 135;}
		if ((y > h) && (x < 1)){y = h; x = 1; dir = 315;}
		if ((y > h) && (x > w)){y = h; x = w; dir = 225;}
		//edge rebounds.
		if (y < 1) {y = 1; dir = hb;}  
		if (y > h) {y = h; dir = hb;}  
		if (x < 1) {x = 1; dir = Math.random() > .7 ? 180 : 0;} 
		if (x > w) {x = w; dir = Math.random() > .3 ? 180 : 0;} 

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
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