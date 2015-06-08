'use strict';

angular.module('speechBubbleApp')
.filter('facets', function() {
  return function(key) {
    return key.split(/(?=[A-Z])/).join('-').toLowerCase();
  };
});
