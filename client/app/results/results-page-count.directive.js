'use strict';

angular.module('speechBubbleApp')
.directive('pageCount', function($compile) {
  return {
   link: function(scope, element, attrs) {
     function updateResultsText() {
       var min = (scope.search.page - 1) * scope.search.limit + 1;
       var upper = scope.search.page * scope.search.limit;
       var max =  upper < scope.total ? upper : scope.total;
       element.html('Displaying <strong>' + min + '-' + max + '</strong> of <strong>' + scope.total + '</strong> ' + attrs.pageType);
     }
     scope.$watch('[total, search.page]', updateResultsText);
   }
  };
});
