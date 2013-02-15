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

      this.startOAuth = function( ev, data ) {
        var socket = io.connect( 'http://localhost' );
        socket.emit( 'db data request' );
      };

      this.setData = function( data ){
        dataStore.users = data.users;
        dataStore.oauth = data.oauth;
        dataStore.results = data.results;
        
        that.trigger( 'userInfoServed', { markup: that.renderMenu(  data  ), oauth: dataStore.oauth, results: dataStore.results } );
        if(dataStore.oauth){
          if( typeof (that.getUser( { results: dataStore.results })) !== 'undefined' ){
            that.trigger( 'localUserServed', { details: that.getUser( { results: dataStore.results } ) } );
          }
          else{
            var handle = dataStore.results.screen_name;
            that.trigger( 'localUserServed', { dummy: dataStore.dummyUsers, handle: handle } );
          }
        };
      };

      this.getUser = function( data ){
        var match = dataStore.users.filter(function ( user ) { return user.handle == data.results.screen_name });
        return match[0];
      };
      
      this.renderMenu = function( data ){
        return menuTemplate( data );
      };

      this.postTweet = function( e, data ){
        $.ajax('/auth/twitter/tweet', {
            type: 'GET',
            dataType: 'json',
            data: { status: data.status },
            success: that.trigger( 'userTweetPosted', data ),
            error  : function()     { if ( callback ) callback(null); }
        });
      };

      this.requestLogIn = function( e, data ){
        var username = data.username;
        window.location.href = '/auth/twitter?username=' + username;
      };

      this.after( 'initialize', function() {
        that = this;
        this.on( 'userInfoRequested', this.startOAuth );
        this.on( 'localUserRequested', this.getUser );
        this.on( 'postTweet', this.postTweet );
        this.on( 'requestLogIn', this.requestLogIn );

        var socket = io.connect( 'http://localhost' );
        socket.on( 'db data returned', this.setData )
        socket.on( 'test', this.test )
      });
    }

  }
);