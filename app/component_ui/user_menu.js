'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(userMenu);

    function userMenu() {

      this.defaultAttrs({
        logInSubmitSelector : '.login-submit',
        tweetSubmitSelector: '.tweet-submit',
        requestSelector: '.request'
      });

      this.showUser = function( e, data ){
        this.$node.html( data.markup );
        this.trigger('userMenuRendered', data );
      };

      this.after('initialize', function() {
        this.on( document, 'userInfoServed', this.showUser );
        this.on( 'click',  {
          logInSubmitSelector: this.flipToggle,
          tweetSubmitSelector : this.setAsProfile,
          downloadSelector : this.downloadEightBit
        } );

        this.trigger('userInfoRequested');
      });
    }
  }
);
