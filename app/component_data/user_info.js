'use strict';

define(

  [
    'components/flight/lib/component',
    'app/data',
    'hbs!app/templates/user_menu',
    '/socket.io/socket.io.js'
  ],

  function(defineComponent,
    dataStore,
    menuTemplate ) {

    return defineComponent(userInfo);

    function userInfo() {

      var that;

      this.startOAuth = function(ev, data) {
        var socket = io.connect("http://localhost");
        socket.emit('lookingForOauth');
      };
      
      this.getUser = function(data){
        dataStore.oauth.push({
          oauth: data.oauth, 
          results: data.results
        });
        that.trigger( 'userInfoServed', { markup: that.renderMenu(  data  ), oauth: dataStore.oauth, results: dataStore.results } );
      };
      
      this.renderMenu = function( data ){
        return menuTemplate( data );
      };

      this.after('initialize', function() {
        that = this;
        this.on( 'userInfoRequested', this.startOAuth );

        var socket = io.connect("http://localhost");
        socket.on("oauth returned", this.getUser);
      });
    }

  }
);