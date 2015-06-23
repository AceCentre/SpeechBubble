'use strict';

angular.module('speechBubbleApp')
.controller('MainCtrl', function (Auth, User, $sce, $rootScope, $scope, $modal, $state, $location, $http, ProductOptions, ProductSearch, FancyFacets, growl) {
  
  angular.extend($scope, {
    'endpoint': '/api/product/:id',
    'search': ProductSearch,
    'devices': ProductOptions.devices,
    'isLoggedIn': Auth.isLoggedIn,
    'recentlyPublished': [],
    'user': Auth.getCurrentUser(),
    'filters': {},
    'options': {
      'access': []
    },
    'getThumbnail': function(item) {
      return $sce.trustAsResourceUrl( item.images.length && item.images[0].url || '/assets/images/products/default-thumbnail.png' );
    },
    'facets': [],
    'applyFilters': function() {
      $location.url('/products').search({ 'facets': $scope.facets });
    }
  });
  
  $scope.$watch('facets', function() {
    $http.get('/api/product', {
      'params': {
        'facets': $scope.facets
      }
    })
    .success(function(res) {
      $scope.results = res.total;
    });   
  });
  
  $scope.$watch('filters', function() {
    $scope.facets = FancyFacets($scope.filters);
  }, true);
  
  $http.get('/api/product', {
    'params': {
      'sort': 'updatedAt',
      'limit': 3
    }
  })
  .success(function(res) {
    $scope.recentlyPublished = res.items;
  });

  $scope.clearSearchFilters = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term') {
        delete $scope.search[key];
      }
    });
    $scope.search.type = '';
  };
  
  $scope.create = function() {
    var modalInstance = $modal.open({
      templateUrl: 'app/admin/products/create.html',
      controller: 'AdminProductCreateCtrl',
      backdrop: 'static'
    });

    modalInstance.result.then(function() {
      $rootScope.$broadcast('resultsUpdated');
    }, function() {
      $rootScope.$broadcast('resultsUpdated');
    });
  };

  // Clear search filters when type is changed
  $scope.clearSearchRetainType = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term' && key !== 'type') {
        delete $scope.search[key];
      }
    });
  };

  $scope.viewAll = function() {
    $state.go('products');
  };

});
