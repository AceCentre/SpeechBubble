'use strict';

angular.module('speechBubbleApp')
.directive('destroy', function() {
  return function(scope, elem, attrs) {
    scope.$on('$destroy', function() {
      if(scope.product[attrs.destroy]) {
        delete scope.product[attrs.destroy];
      }
    });
  }
});
