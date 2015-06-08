'use strict';

angular.module('speechBubbleApp')
  .controller('HeaderCtrl', function ($scope, $location, Auth, ProductSearch, $state) {
	  $scope.search = ProductSearch;
	  
	  $scope.submit = function(term, event) {
      var term = term || '';
      if(event) {
        event.preventDefault();
      }
      if($state.current.name === 'products') {
        return $scope.search.term = term;
      }
      if(!term) {
        return $location.url('/products');
      }
		  return $location.url('/products').search({ 'term': term  })
	  }
    
    $scope.$watch('search.term', function(term) {
      $scope.term = term;
    });
  });