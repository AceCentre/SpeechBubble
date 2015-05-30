'use strict';

angular.module('speechBubbleApp')
.filter('published', function() {
  return function(revisions) {
    return revisions.filter(function(revision) {
      return revision.published;
    });
  };
});
