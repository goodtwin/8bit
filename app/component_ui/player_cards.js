'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent( playerCards );

    function playerCards() {

      this.defaultAttrs( {
        visualSelector : '.visual',
        detailsSelector : '.details',
        setAsSelector : '.set-as',
        downloadSelector : '.download',
        eightBitSelector: '.eight-bit',
        eightBitInnerSelector: '.eight-bit-inner',
        flippedClass: 'flipped'
      } );

      this.showCards = function( e, data ){
        this.$node.html( data.markup );
        this.trigger( 'playerCardsShown', { oauth: data.oauth, results: data.results } );
        if( data.oauth ){
          this.setUserInteractions( { oauth: data.oauth, results: data.results } );
        }
      };

      this.setUserInteractions = function(data){
        var userHandle = data.results.screen_name;
        $( '.' + userHandle ).addClass( 'user' )
        $( '.' + userHandle + ' .details .detail_btn' ).remove()
        $( '.' + userHandle + ' .details' )
          .append( '<a href="#" class="detail_btn set-as">Set As Twitter Profile</a>' ) 
          .append( '<a href="#" class="detail_btn download">Download 8-Bit</a>' ); 
      };

      this.flipToggle = function(e){
        var that = $( e.target ).closest( this.select( 'eightBitSelector' ) );
        that.toggleClass( this.attr.flippedClass );
        that.siblings().removeClass( this.attr.flippedClass );
      };

      this.downloadEightBit = function( e, data ){
        e.preventDefault();
        var id = data.el.offsetParent.id;
        this.trigger('requestDownload', { id: id });
      };

      this.setAsProfile = function( e, data ){
        e.preventDefault();
        var id = data.el.offsetParent.id;
        this.trigger('requestProfilePost', { id: id });
      };
      
      this.after( 'initialize', function() {
        this.on( document, 'playerCardsServed', this.showCards );
        this.on( 'click',  {
          eightBitSelector: this.flipToggle,
          setAsSelector : this.setAsProfile,
          downloadSelector : this.downloadEightBit
        } );
      });
    }
  }
);
