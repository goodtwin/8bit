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
        console.log(data);
        that.trigger( 'userInfoServed', { markup: that.renderMenu(data) } );
      };
      
      this.renderMenu = function(){
        return menuTemplate({});
      };

      this.after('initialize', function() {
        that = this;
        this.on( 'userInfoRequested', this.startOAuth );
        //this.on( 'oauthServed', this.getUser );

        var socket = io.connect("http://localhost");
        socket.on("oauth returned", this.getUser);
      });
    }

  }
);