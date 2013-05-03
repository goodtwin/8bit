/*global define, document */

(function(){
	'use strict';

	define(

		[
			'app/component_data/user_info',
			'app/component_data/users_location',
			'app/component_data/cards_info',
			'app/component_data/request_info',
			'app/component_ui/player_cards',
			'app/component_ui/the_streets',
			'app/component_ui/user_menu',
			'app/component_ui/request_form'
		],

		function(
			UserInfoData,
			UsersLocationData,
			CardsInfoData,
			RequestInfoData,
			PlayerCardsUI,
			TheStreetsUI,
			UserMenuUI,
			RequestFormUI ) {
			function initialize() {
				UserInfoData.attachTo(document);
				UsersLocationData.attachTo(document);
				CardsInfoData.attachTo(document);
				RequestInfoData.attachTo(document);
				PlayerCardsUI.attachTo('.bits-container');
				TheStreetsUI.attachTo('.scape');
				UserMenuUI.attachTo('.footer');
				RequestFormUI.attachTo('.header');
			}

			return initialize;
		}
	);
})();