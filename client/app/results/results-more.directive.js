'use strict';

angular.module('speechBubbleApp')

.filter('more', function () {
  return function (value, max, url) {

    if (!value) {
      return '';
    }

    max = parseInt(max, 10);

    if (!max) {
      return value;
    }

    if (value.length <= max) {
      return value;
    }

    value = value.substr(0, max);

    return value.trim() + '...';
  };
});
