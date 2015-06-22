'use strict';

angular.module('speechBubbleApp')
.directive('destroy', function($parse) {
  return function(scope, elem, attrs) {
    if(attrs.destroy.indexOf('.') > -1) {
      scope.$on('$destroy', function() {
        var getter = $parse(attrs.destroy);
        return delete getter.assign(scope, null);
      });
    } else {
      scope.$on('$destroy', function() {
        return delete scope.product.features[attrs.destroy];
      });
    }
  };
});
