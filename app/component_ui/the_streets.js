'use strict';

define(

  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(cards);

    function cards() {

      this.defaultAttrs({
      });

      this.after('initialize', function() {
      });
    }
  }
);
