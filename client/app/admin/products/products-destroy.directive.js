'use strict';

angular.module('speechBubbleApp')
.directive('destroy', function() {
  return function(scope, elem, attrs) {
    scope.$watch(attrs.ngShow, function destroyWatchAction(value) {
      if(!value && scope.product.features) {
        delete scope.product.features[attrs.destroy];
      }
    });
  }
});
