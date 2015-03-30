'use strict';

angular.module('speechBubbleApp')
.directive('affix', function() {
  return {
    link: function(scope, element, attrs) {
      element.affix({
        top: attrs['data-offset-top'],
        bottom: attrs['data-offset-bottom']
      });
    }
  };
});
