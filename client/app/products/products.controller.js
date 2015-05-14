'use strict';

angular.module('speechBubbleApp')

.controller('ProductsCtrl', function ($scope, $http, $location, Auth, $modal, $rootScope, growl, ProductCompareTemplate, ProductOptions, ProductSearch, PageTitle) {

  PageTitle('Product Search');

  $scope.endpoint = '/api/product/:id';
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.comparing = [];
  $scope.devices = ProductOptions.devices;
  $scope.search = ProductSearch;

  angular.extend($scope.search, $location.search());

  $scope.performSearch = function() {
    $rootScope.$broadcast('resultsUpdated');
  };

  $scope.clearSearchFilters = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term') {
        delete $scope.search[key];
      }
    });
    $scope.search.type = '';
    $scope.performSearch();
  };


  // Clear search filters when type is changed
  $scope.clearSearchRetainType = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term' && key !== 'type') {
        delete $scope.search[key];
      }
    });
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

  $scope.clearCompare = function(item) {
    if(item) {
      var index = $scope.comparing.indexOf(item);
      if(index > -1) {
        $scope.comparing.splice(index, 1);
      }
    } else {
      $scope.comparing = [];
    }
  };

  $scope.goCompare = function() {
    var modal = ProductCompareTemplate($scope.comparing[0]);

    var modalInstance = $modal.open({
      templateUrl: modal.template,
      controller: modal.controller,
      size: 'lg',
      resolve: {
        products: function() {
          return $scope.comparing;
        }
      }
    });
  };

  $scope.compare = function(product) {
    if($scope.isComparingProduct(product)) {
      var i = $scope.comparing.indexOf(product);
      $scope.comparing.splice(i, 1);
      return growl.warning('Removed product to comparison.');
    } else if($scope.comparing.length >= 4) {
      return growl.warning('You can only compare 4 items at a time.');
    } else if( $scope.canCompareProduct(product) ) {
      growl.success('Added product to comparison.');
      $scope.comparing.push(product);
    } else {
      growl.warning('You can only compare products that are the same type.');
    }
  };

  $scope.isComparingProduct = function(product) {
    // less effient than indexOf but required to workaround page change
    var isEqual = false;
    $scope.comparing.forEach(function(item) {
      if( angular.equals(product, item) ) {
        isEqual = true;
      }
    });
    return isEqual;
  };

  $scope.canCompareProduct = function(product) {
    return $scope.comparing.length === 0 || ($scope.comparing[0].type === product.type);
  };
})

.controller('ProductDetailCtrl', function($state, $http, $scope, $location, product, Rating, ProductTemplate, ProductVideos, PageTitle, $modal, Auth) {
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.videos = ProductVideos($scope);
  $scope.product = product.data;
  $scope.comments = true;

  PageTitle($scope.product.name);

  Rating.get({ id: $scope.product._id }, function(res) {
    $scope.ratings = res;
  });

  $scope.edit = function(product) {
    var modal = ProductTemplate(product);
    $modal.open({
      templateUrl: modal.template,
      controller: modal.controller,
      size: 'lg',
      resolve: {
        current: function() {
          return product;
        }
      }
    });
  };

  // Related Software for Vocabulary
  if($scope.product.type === 'ProductVocabulary') {
    $scope.relatedSoftwareForVocabulary = [];
    $http({
      method: 'GET',
      url: '/api/product/softwareForVocabulary/',
      params: { vocabulary: $scope.product._id }
    })
    .success(function(res) {
      $scope.relatedSoftwareForVocabulary = res;
    });
  }

  if($location.search().edit) {
    $scope.edit($scope.product);
  }

});
