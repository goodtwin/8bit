'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent( requestForm );

    function requestForm() {

      this.defaultAttrs( {
        navButtonSelector: '.nav_btn',
        requestFormSelector: '.request-form',
        requestSubmitSelector: '.request-submit',
        humanSelctor: '#human',
        firstNameSelctor: '#first_name',
        emailSelctor:'#email',
        handleSelctor:'#handle',
        textSelector: '#request-box-text'
      } );

      this.showForm = function( e, data ){
        this.$node.html( data.markup );
      };

      this.toggleForm = function( e, data ){
        this.select( 'humanSelctor' ).val('');
        this.select( 'firstNameSelctor' ).val('');
        this.select( 'emailSelctor' ).val('');
        this.select( 'handleSelctor' ).val('');
        this.select( 'textSelector' ).val('');
        this.select( 'requestFormSelector' ).slideToggle();
      };

      this.submitClicked = function(e, data){
        e.preventDefault();
        var test = this.select( 'humanSelctor' ).val(),
            firstName = this.select( 'firstNameSelctor' ).val(),
            email = this.select( 'emailSelctor' ).val(),
            handle = this.select( 'handleSelctor' ).val(),
            text = this.select( 'textSelector' ).val();

        if( test == 8 ){
          this.trigger( 'sendEmail', { firstName: firstName, email: email, handle: handle, text: text } )
        }
        else {
          this.toggleForm();
        }
      };
      
      this.after( 'initialize', function() {
        this.on( document, 'requestFormServed', this.showForm );
        this.on( document, 'emailSent', this.toggleForm );
        this.on( 'click',  {
          navButtonSelector: this.toggleForm,
          requestSubmitSelector: this.submitClicked,
        } );
      });
    }
  }
);
