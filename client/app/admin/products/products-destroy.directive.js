'use strict';

angular.module('speechBubbleApp')
.directive('destroy', function() {
  return function(scope, elem, attrs) {
    scope.$on('$destroy', function() {
      if(scope.product.features[attrs.destroy]) {
        delete scope.product.features[attrs.destroy];
      }
    });
  }
});
