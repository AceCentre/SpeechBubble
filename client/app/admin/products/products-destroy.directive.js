'use strict';

angular.module('speechBubbleApp')
.directive('destroy', function($parse) {
  return function(scope, elem, attrs) {
    if(attrs.destroy.indexOf('.') > -1) {
      scope.$on('$destroy', function() {
        var getter = $parse(attrs.destroy);
        return getter.assign(scope, null);
      });
    } else {
      scope.$on('$destroy', function() {
        return scope.product.features[attrs.destroy] = null;
      });
    }
  };
});
