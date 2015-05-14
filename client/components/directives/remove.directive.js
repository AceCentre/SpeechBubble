'use strict';

angular.module('speechBubbleApp')
.directive('remove', function() {
  return function(scope, element, attrs) {
    element.remove();
  };
});
