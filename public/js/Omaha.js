/**************************************************
** OMAHA CLASS
**************************************************/
var Omaha = function(startX, startY) {
	var x = startX,
		y = startY;

	var srcSvg = $('.-bit_andy-peters').css('background-image').replace('url(','').replace(')',''),
		img = new Image();
		img.src = srcSvg;
	// var srcSvg = $('.-bit_andrew-wirick').css('background-image').replace('url(','').replace(')','');
	// var img = new Image();
	// img.src = srcSvg;
	
	// Getters and setters
	// var getX = function() {
	// 	return x;
	// };

	// var getY = function() {
	// 	return y;
	// };

	// var setX = function(newX) {
	// 	x = newX;
	// };

	// var setY = function(newY) {
	// 	y = newY;
	// };

	// Update player position
	// var update = function(keys) {
	// 	// Previous position
	// 	var prevX = x,
	// 		prevY = y;

	// 	// Up key takes priority over down
	// 	if (keys.up) {
	// 		y = y - dy > 0 ? y - dy : prevY;
	// 	} else if (keys.down) {
	// 		y = y + dy < canvas.height-80 ? y + dy : prevY;
	// 	};

	// 	// Left key takes priority over right
	// 	if (keys.left) {
	// 		x = x - dx > 0 ? x - dx : prevX;
	// 	} else if (keys.right) {
	// 		x = x + dx < canvas.width-50 ? x + dx : prevX;
	// 	};

	// 	return (prevX != x || prevY != y) ? true : false;
	// };

	// Draw player
	var drawOmaha = function(ctx) {
		//$(window).load(function() {
			//$( '.eight-bit' ).each(function( index ){
				
				img.onload = function() {
					ctx.drawImage(img, x, y);
				}
			//});
		//});
	};
	var randX = function() {
		return Math.round(Math.random()*(canvas.width-40));
	};

	var randY = function() {
		return Math.round(Math.random()*(canvas.height-40));
	};


	// Define which variables and methods can be accessed
	return {
		// getX: getX,
		// getY: getY,
		// setX: setX,
		// setY: setY,
		// update: update,
		drawOmaha: drawOmaha
	}
};