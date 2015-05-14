'use strict';

angular.module('speechBubbleApp')
.directive('httpPrefix', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, controller) {
      function forceHttpPrefix(value) {
        if(value && !/^(https?):\/\//i.test(value) && ('http://'.indexOf(value) === -1 && 'https://'.indexOf(value) === -1)) {
          controller.$setViewValue('http://' + value);
          controller.$render();
          return 'http://' + value;
        }
        else {
          return value;
        }
      }
      controller.$parsers.push(forceHttpPrefix);
      controller.$formatters.push(forceHttpPrefix);
    }
  };
});
