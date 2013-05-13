"use strict";
/* global define */

define([ "./app",
	"scripts/eightbit/services/localfactory" ],
	function( app, devProvider ){
		return app.start( "gt.eightbit", [devProvider] );
	}
);