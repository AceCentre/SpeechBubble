'use strict';

angular.module('speechBubbleApp')
  .filter('type', function () {
    return function(input) {
      return input.replace('Product', '').replace(/([A-Z])/g, ' $1').trim();
    };
  });
