'use strict';

define(

  [
    'app/component_data/user_info',
    'app/component_data/users_location',
    'app/component_data/cards_info',
    'app/component_ui/player_cards',
    'app/component_ui/the_streets',
    'app/component_ui/user_menu'
  ],

  function(
    UserInfoData,
    UsersLocationData,
    CardsInfoData,
    PlayerCardsUI,
    TheStreetsUI,
    UserMenuUI ) {
    function initialize() {
      UserInfoData.attachTo(document);
      UsersLocationData.attachTo(document);
      CardsInfoData.attachTo(document);
      PlayerCardsUI.attachTo('.bits-container');
      TheStreetsUI.attachTo('.scape');
      UserMenuUI.attachTo('.nav');
    }

    return initialize;
  }
);
