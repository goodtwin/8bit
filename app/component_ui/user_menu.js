'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(cards);

    function cards() {

      this.defaultAttrs({
      });

      this.showUser = function( e, data ){
        this.$node.html( data.markup );
      }

      this.after('initialize', function() {
        this.on( document, 'userInfoServed', this.showUser );
        this.trigger('userInfoRequested');
      });
    }
  }
);
