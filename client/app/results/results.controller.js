'use strict';

angular.module('speechBubbleApp')
  .controller('ResultsCtrl', function ($scope, $resource, $location, Modal, growl) {

    var api = $resource($scope.endpoint, { id: '@_id' }, { query: { method: 'GET' } });

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

    $scope['delete'] = Modal.confirm['delete'](function(item) { // callback when modal is confirmed
      api.remove({ id: item._id });
      angular.forEach($scope.items, function(current, index) {
        if (current === item) {
          $scope.items.splice(index, 1);
        }
      });
    });

    $scope.$watch('page', updateResults);
    $scope.$on('resultsUpdated', updateResults);

  });
