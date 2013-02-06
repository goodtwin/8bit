'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(playerCards);

    function playerCards() {

      this.defaultAttrs({
        visualSelector : '.visual',
        detailsSelector : '.details',
        eightBitSelector: '.eight-bit',
        flippedClass: 'flipped'
      });

      this.showCards = function( e, data ){
        this.$node.html( data.markup );
        this.trigger('playerCardsShown', { });
      };

      this.flipToggle = function(e){
        var that = $(e.target).closest(this.select('eightBitSelector'));
        that.toggleClass( this.attr.flippedClass );
        that.siblings().removeClass( this.attr.flippedClass );
      };
      
      this.after('initialize', function() {
        this.on( document, 'playerCardsServed', this.showCards );
        this.on( 'click',  {
          visualSelector: this.flipToggle,
          detailsSelector: this.flipToggle
        });
      });
    }
  }
);
