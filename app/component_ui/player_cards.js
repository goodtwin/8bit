'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(playerCards);

    function playerCards() {

      this.defaultAttrs({
      });

      this.showCards = function( e, data ){
        this.$node.html( data.markup );
      }

      this.flipToggle = function(e){
          var p = $( this ).parent();
          p.toggleClass( 'flipped' );
          p.siblings().removeClass( 'flipped' );
      }
      
      this.after('initialize', function() {
        this.on( document, 'playerCardsServed', this.showCards );
        this.on( 'click',  this.flipToggle);
      });
    }
  }
);
