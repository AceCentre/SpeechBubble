'use strict';

angular.module('speechBubbleApp')
.directive('pageCount', function($compile) {
  return {
   link: function(scope, element, attrs) {
     function updateResultsText() {
       var min = scope.skip + 1;
       var max = (scope.skip + scope.limit) < scope.total ? scope.skip + scope.limit: scope.total;
       element.html('Displaying <strong>' + min + '-' + max + '</strong> of <strong>' + scope.total + '</strong> ' + attrs.pageType);
     }
     scope.$watch('[skip, total, limit]', updateResultsText);
   }
  };
});
