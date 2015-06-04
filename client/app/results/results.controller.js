'use strict';

angular.module('speechBubbleApp')
  .controller('ResultsCtrl', function ($scope, $resource, $location, Modal, growl, $sce) {

    var api = $resource($scope.endpoint, { id: '@_id' }, { query: { method: 'GET' } });

    $scope.isLoading = false;
    $scope.initial = true; // used to determine if we are yet to fetch results
    $scope.limit = $scope.limit || Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;
    
    

    function fetch() {
      var facets = _.compactObject($scope.search.facets).keys().value();
      $scope.isLoading = true;
      $scope.skip = ($scope.page - 1) * $scope.limit;
      var query = angular.extend({
        'skip': $scope.skip,
        'limit': $scope.limit
      }, $scope.search, { 'facets': facets });

      api.query(query, function(res) {
        $scope.isLoading = false;
        $scope.initial = false;
        $scope.items = res.items;
        $scope.total = res.total;
      }, function(err) {
        $scope.isLoading = false;
        growl.error(err);
      });
    }

    var debounceFetch = _.debounce(fetch, 300);

    function updateResults(newValue, oldValue) {
      // fetch results after user stops typing for 300ms
      if(newValue && oldValue && (newValue.term !== oldValue.term)) {
        debounceFetch();
      } else {
        fetch();
      }
    }

    $scope.getThumbnail = function(item) {
      return $sce.trustAsResourceUrl( item.images.length && item.images[0].url || '/assets/images/products/default-thumbnail.png' );
    };

    $scope['delete'] = Modal.confirm['delete'](function(item) { // callback when modal is confirmed
      api.remove({ id: item._id });
      angular.forEach($scope.items, function(current, index) {
        if (current === item) {
          $scope.items.splice(index, 1);
        }
      });
    });

    $scope.$watch('page', function() {
      updateResults();
      $('html, body').stop().animate({ scrollTop: 0 }, 400);
    });

    $scope.$on('resultsUpdated', updateResults);
    $scope.$watch('search', updateResults, true);

  });
