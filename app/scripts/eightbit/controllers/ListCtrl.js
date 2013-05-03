define([
	'angular',
	'scripts/eightbit/services/eightbits'], 
	function(
		angular,
		EightBits){
		var myModule  = angular.module( "controllers.ListCtrl", [ "services.eightbit" ]);

		myModule.controller( "ListCtrl", function( $scope, $routeParams, EightBits ){
			EightBits.eightbits().success( function( data ){
				$scope.eightbits = data;
			});
		});
		return myModule;
});