'use strict';

angular.module('speechBubbleApp')
.directive('pageCount', function($compile) {
  return {
   link: function(scope, element, attrs) {
     function updateResultsText() {
       var page = scope.search.page || 1;
       var limit = scope.search.limit || 10;
       var min = (page - 1) * limit + 1;
       var upper = page * limit;
       var max =  upper < scope.total ? upper : scope.total;
       element.html('Displaying <strong>' + min + '-' + max + '</strong> of <strong>' + scope.total + '</strong> ' + attrs.pageType);
     }
     scope.$watch('[total, search.page]', updateResultsText);
   }
  };
});
