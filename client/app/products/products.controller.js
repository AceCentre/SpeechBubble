'use strict';

angular.module('speechBubbleApp')
  .controller('ProductsCtrl', function ($scope, $window, $modal, $location, Product, growl) {

    $scope.limit = Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;

    function updateResults(page, lastPage) {
      $scope.skip = ($scope.page - 1) * $scope.limit;
      Product.query({
        skip: $scope.skip,
        limit: $scope.limit,
        term: $scope.search.term
      }, function(res) {
        $scope.products = res.products;
        $scope.total = res.total;
        $('html, body').stop().animate({ scrollTop: 0 }, 400);
      }, function(err) {
        growl.error(err);
      });
    }

    $scope.reset = function() {
      $scope.page = 1;
      updateResults();
    };

    $scope.$watch('page', updateResults);

  });
