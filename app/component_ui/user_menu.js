'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(userMenu);

    function userMenu() {

      this.defaultAttrs({
        //logInSubmitSelector : '.login-submit',
        tweetSubmitSelector: '.tweet-submit',
        tweetBoxSelector: '.tweet-box textarea',
        usernameSelector: '#twitter_screen_name',
        passwordSelector: '#twitter_password',
        requestSelector: '.request'
      });

      this.showUser = function( e, data ){
        this.$node.html( data.markup );
        this.trigger('userMenuRendered', data );
      };

      // this.logIn = function(e, data){
      //   e.preventDefault();
      //   var username = this.select( 'usernameSelector' ).val();
      //   this.trigger( 'requestLogIn', { username: username } );
      //   //console.log(username);
      //   //var password = this.select( 'passwordSelector' ).val();
      //   //this.setAttribute('href', '/auth/twitter/tweet?status='+encodeURIComponent( document.getElementById('tweet-box-text').value ) )
      // };

      this.submitTweet = function(e, data){
        e.preventDefault();
        var status = this.select( 'tweetBoxSelector' ).val();
        if( status.length > 0 ){
          this.trigger( 'postTweet', { status: status } );
        }
      };

      this.after('initialize', function() {
        this.on( document, 'userInfoServed', this.showUser );
        this.on( 'click',  {
          tweetSubmitSelector : this.submitTweet,
        } );

        this.trigger('userInfoRequested');
      });
    }
  }
);
