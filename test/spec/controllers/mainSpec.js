/* global define describe it expect */
'use strict';

define(['jquery',
  'angular-mocks',
  'app/scripts/modules/helloworld/controller'],

  function( $, 
    mock,
    helloWorldModule) {

    describe('Controller: MainCtrl', function () {

      // load the controller's module
      beforeEach( mock.module('helloworld.controller') );

      var MainCtrl,
        scope;

      // Initialize the controller and a mock scope
      beforeEach( mock.inject( function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller( 'MainCtrl', {
          $scope: scope
        });

      }));

      it('should attach a list of awesomeThings to the scope', function () {
        expect( scope.awesomeThings.length ).toBe(3);
      });
    });

});
