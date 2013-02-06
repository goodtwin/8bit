'use strict';

define(

  [
    'components/flight/lib/component',
    'app/data',
    'hbs!app/templates/the_streets',
    '/socket.io/socket.io.js'
  ],

  function(defineComponent,
    dataStore,
    streetsTemplate ) {

    return defineComponent(streetInfo);

    function streetInfo() {

      this.getTheStreets = function(){
        this.trigger( 'theStreetsServed', { markup: this.renderTheStreets({ oauth: false }) } );
      }

      this.renderTheStreets = function(){
        return streetsTemplate({});
      }

      this.after("initialize", function() {
        this.on( document, 'playerCardsShown', this.getTheStreets );
      });
    }

  }
);