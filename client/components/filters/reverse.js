'use strict';

angular.module('speechBubbleApp')
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
