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

      this.after('initialize', function() {
        this.on( document, 'theStreetsServed', this.showCanvas );
      });
    }
  }
);
