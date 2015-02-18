'use strict';

angular.module('speechBubbleApp')
.filter('from', function() {
  return function(input, start) {
    if(input) {
      return input.slice(start);
    }
    return [];
  };
});
