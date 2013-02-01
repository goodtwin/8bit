'use strict';

define(

  [
    'components/flight/lib/component',
    'app/data',
    'hbs!app/templates/user_menu'
  ],

  function(defineComponent,
    dataStore,
    menuTemplate ) {

    return defineComponent(userInfo);

    function userInfo() {

      this.startOAuth = function(ev, data) {

      };
      this.getUser = function(){
        this.trigger( 'userInfoServed', { markup: this.renderMenu({ oauth: false }) } );
      }
      this.renderMenu = function(){
        return menuTemplate({});
      }
      this.after('initialize', function() {
        this.on( 'userInfoRequested', this.getUser );
      });
    }

  }
);