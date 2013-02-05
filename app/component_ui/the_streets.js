'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(theStreets);

    function theStreets() {

      this.defaultAttrs({
      });

      this.showCanvas = function( e, data ){
        this.$node.html( data.markup );
      }

      this.renderEightBits = function(){
        init();
        animate();
      }

      this.after('initialize', function() {
        this.on( document, 'theStreetsServed', this.showCanvas );
        this.on( document, 'playerCardsShown', this.renderEightBits);
      });
    }
  }
);
