/* global $filter */
'use strict';

define(['jquery',
	'angular',
	'app/scripts/eightbit/filters/trim',
	'angular-mocks'],

	function( $, angular, trimFilter) {

		describe('Filter: trim', function () {

			var $fltr,
				trimModule = angular.module('trimFilter', []);

			trimFilter.init( trimModule, angular );

			beforeEach(function(){
				angular.mock.module('trimFilter');
			});

			beforeEach( angular.mock.inject( function( $filter ){
				$fltr = $filter;
			}));

			it('removes spaces from anywhere in text', function () {
				var result = $fltr('trim')('hi there');
				expect(result).toEqual('hithere');
			});

		});

	});