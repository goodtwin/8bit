'use strict';

define(

  [
    'components/flight/lib/component',
    'app/data',
    'hbs!app/templates/player_cards',
    '/socket.io/socket.io.js'
  ],

  function(defineComponent,
    dataStore,
    cardsTemplate ) {

    return defineComponent(cardsInfo);

    function cardsInfo() {
      var s = this;

      this.startOAuth = function(ev, data) {

      };
      
      this.getPlayerCards = function(data){
        this.trigger( 'playerCardsServed', { 
          markup: this.renderCards( { users: dataStore.users, oauth: false } ) 
        });
      };

      this.renderCards = function(data){
        return cardsTemplate(data);
      };

      this.after('initialize', function() {
        this.on( document, 'userInfoServed', this.getPlayerCards );
      });
    }

  }
);