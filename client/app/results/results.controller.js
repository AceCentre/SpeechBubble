'use strict';

angular.module('speechBubbleApp')
  .controller('ResultsCtrl', function ($scope, $resource, $location, endpoint, growl) {

    var api = $resource(endpoint,
        { id: '@_id' },
        {
          query: { method: 'GET' }
        }
      );

    $scope.limit = Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;

    function updateResults() {
      $scope.skip = ($scope.page - 1) * $scope.limit;
      api.query({
        skip: $scope.skip,
        limit: $scope.limit,
        term: $scope.search.term
      }, function(res) {
        $scope.items = res.items;
        $scope.total = res.total;
        $('html, body').stop().animate({ scrollTop: 0 }, 400);
      }, function(err) {
        growl.error(err);
      });
    }

    $scope.$watch('page', updateResults);

  });
