'use strict';

define(['jquery',
	'angular',
	'app/scripts/eightbit/directives/flip',
	'angular-mocks'],

	function( $, angular, flipDirective) {


		describe('Directive: flip', function () {

			var $cmp,
				$rScope,
				flipModule = angular.module('flipDirective', []);

			flipDirective.init( flipModule, angular );

			beforeEach(function(){
				angular.mock.module('flipDirective');
			});

			beforeEach( angular.mock.inject( function( $compile, $rootScope ){
				$cmp = $compile;
				$rScope = $rootScope;
			}));

			it('toggles flipped on the element', function () {
				var elem = $cmp('<div class="flip"></div>')($rScope),
					$elem = angular.element(elem);
				$elem.trigger('click');
				expect( $elem.hasClass( 'flipped' ) ).toBeTruthy();
				$elem.trigger('click');
				expect( $elem.hasClass( 'flipped' ) ).toBeFalsy();
			});

			it('removes flipped on siblings', function () {
				var elems = $cmp('<div><div class="flip"></div><div class="flipped"></div></div>')($rScope),
						$elem = $(elems).find('.flip');
				$elem.trigger('click');
				expect( $elem.siblings().hasClass( 'flipped' ) ).toBeFalsy();
			});

		});

	});