'use strict';

define(

  [
    'app/component_data/user_info',
    'app/component_data/users_location',
    'app/component_ui/player_cards',
    'app/component_ui/the_streets',
    'app/component_ui/user_menu'
  ],

  function(
    UserInfoData,
    UsersLocationData,
    PlayerCardsUI,
    TheStreetsUI,
    UserMenuUI ) {
    function initialize() {
      UserInfoData.attachTo(document);
      UsersLocationData.attachTo(document);
      PlayerCardsUI.attachTo('#userInfo');
      TheStreetsUI.attachTo('#theStreets');
      UserMenuUI.attachTo('#playerCards');
    }

    return initialize;
  }
);
