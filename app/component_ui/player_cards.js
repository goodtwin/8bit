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
        eightBitInnerSelector: '.eight-bit-inner',
        flippedClass: 'flipped'
      });

      this.showCards = function( e, data ){
        this.$node.html( data.markup );
        this.trigger('playerCardsShown', { oauth: data.oauth, results: data.results });
      };

      this.flipToggle = function(e){
        console.log(e.target);
        var that = $(e.target).closest(this.select('eightBitSelector'));
        that.toggleClass( this.attr.flippedClass );
        that.siblings().removeClass( this.attr.flippedClass );
      };
      
      this.after('initialize', function() {
        this.on( document, 'playerCardsServed', this.showCards );
        this.on( 'click',  {
          eightBitSelector: this.flipToggle
        });
      });
    }
  }
);
