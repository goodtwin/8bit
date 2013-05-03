define([
	'angular'],
	function( angular ){

		var myModule = angular.module( "services.eightbit", []);
		myModule.factory( 'EightBits', {
			eightbits : function( $http ){
				return $http.get( 'data/seed.json' );
			}
		});

		return myModule;
	});