/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Tweet = function(x, y) {

	var draw = function() {
		$('.tweet').css({'top': y, 'left': x)
	};

	// Define which variables and methods can be accessed
	return {
		// getX: getX,
		// getY: getY,
		// setX: setX,
		// setY: setY,
		// update: update,
		draw: draw
	}
};