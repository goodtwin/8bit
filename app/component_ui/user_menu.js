'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(userMenu);

    function userMenu() {

      this.defaultAttrs({
        logInSelector : '.log-in',
        logOutSelector: '.log-out',
        requestSelector: '.request'
      });

      this.showUser = function( e, data ){
        this.$node.html( data.markup );
        this.trigger('userMenuRendered', data );
      };

      this.after('initialize', function() {
        this.on( document, 'userInfoServed', this.showUser );

        this.trigger('userInfoRequested');
      });
    }
  }
);
