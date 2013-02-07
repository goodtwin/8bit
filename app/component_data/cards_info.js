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

      this.startOAuth = function(ev, data) {

      };
      
      this.getPlayerCards = function(e, data){
        this.trigger( 'playerCardsServed', { 
          markup: this.renderCards( { users: dataStore.users, oauth: dataStore.oauth, results: dataStore.results } ),
          oauth: dataStore.oauth, 
          results: dataStore.results  
        });
      };

      this.renderCards = function(data){
        return cardsTemplate(data);
      };

      this.after('initialize', function() {
        this.on( document, 'userMenuRendered', this.getPlayerCards );
      });
    }

  }
);