'use strict';

angular.module('speechBubbleApp')
.directive('affix', function() {
  return {
    link: function(scope, element, attrs) {
      element.affix({
        offset: {
          top: attrs.offsetTop || 0
        }
      });
    }
  };
});
