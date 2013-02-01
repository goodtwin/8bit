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

      this.renderThemStreets = function(){
        return streetsTemplate({});
      }
      this.after("initialize", function() {
      });
    }

  }
);