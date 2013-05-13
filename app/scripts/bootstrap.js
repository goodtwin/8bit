"use strict";
/* global define */

define([ "./app",
	"scripts/eightbit/services/eightbitapi" ],
	function( app, serverProvider ){
		return app.start( "gt.eightbit", [serverProvider] );
	}
);