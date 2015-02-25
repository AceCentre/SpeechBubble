'use strict';

angular.module('speechBubbleApp')
.directive('comments', function() {
  return {
    templateUrl: 'components/comments/disqus.html'
  };
});
