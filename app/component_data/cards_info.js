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

    return defineComponent( cardsInfo );

    function cardsInfo() {

      this.getPlayerCards = function( e, data ){
        this.trigger( 'playerCardsServed', { 
          markup: this.renderCards( { users: dataStore.users, oauth: dataStore.oauth, results: dataStore.results } ),
          oauth: dataStore.oauth, 
          results: dataStore.results  
        });
      };

      this.renderCards = function( data ){
        return cardsTemplate( data );
      };

      this.requestProfilePost = function( e, data ){
        console.log( data );
       var canvas = document.createElement("canvas");
       var img = data.image;
       canvas.width = img.width;
       canvas.height = img.height;
       var ctxt = canvas.getContext("2d");
       ctxt.drawImage(img, 0, 0);
       var dataURL = canvas.toDataURL("image/png");
       var dataURL = canvas.toDataURL("image/png");
       var r=dataURL;
       base64=r;
       console.log(base64);  
        $.ajax('/auth/twitter/set-profile', {
            type: 'GET',
            dataType: 'json',
            success: function(data) { console.log( data ); },
            error  : function()     { if ( callback ) callback(null); }
        });
      };

      this.requestDownload = function( e, data ){
        console.log( data ); 
        $.ajax('auth/twitter/download', {
            type: 'GET',
            dataType: 'json',
            data: { id: data.id },
            success: function(data) { console.log( data ); },
            error  : function()     { if ( callback ) callback(null); }
        });
      };

      this.after( 'initialize', function() {
        this.on( document, 'userMenuRendered', this.getPlayerCards );
        this.on( document, 'requestProfilePost', this.requestProfilePost );
        this.on( document, 'requestDownload', this.requestDownload );
      });
    }

  }
);