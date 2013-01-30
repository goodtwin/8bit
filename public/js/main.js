$( function(){
	$(window).load(function() {
		// Initialise the game
		init();
		animate();
	});
	$( document )
		.ready(function(){
			
		})
		.on( 'click', '.visual, .details', function(e) {
			var p = $( this ).parent();
			p.toggleClass( 'flipped' );
			p.siblings().removeClass( 'flipped' );
		});
});