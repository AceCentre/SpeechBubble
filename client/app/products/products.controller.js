'use strict';

angular.module('speechBubbleApp')

.controller('ProductsCtrl', function ($scope, $sce, $http, $location, Auth, $modal, $rootScope, growl, ProductCompareTemplate, ProductOptions, ProductSearch, PageTitle) {

  PageTitle('Product Search');

  $scope.endpoint = '/api/product/:id';
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.comparing = [];
  $scope.devices = ProductOptions.devices;
  $scope.search = ProductSearch;

  $scope.performSearch = function() {
    $rootScope.$broadcast('resultsUpdated');
  };
  
  $scope.getThumbnail = function(item) {
    return $sce.trustAsResourceUrl( item.images.length && item.images[0].url || '/assets/images/products/default-thumbnail.png' );
  };

  $scope.clearSearchFilters = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term') {
        delete $scope.search[key];
      }
    });
    $scope.search.term = '';
    $scope.search.type = '';
    $scope.performSearch();
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

  $scope.viewComparison = function() {
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
    } else if($scope.comparing.length >= 4) {
      return growl.warning('You can only compare 4 items at a time.');
    } else if( $scope.canCompareProduct(product) ) {
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
    var modalInstance = $modal.open({
      templateUrl: modal.template,
      controller: modal.controller,
      size: 'lg',
      resolve: {
        current: function() {
          return product;
        }
      },
      backdrop: 'static'
    });
    modalInstance.result.then(function (product) {
      $scope.product = product;
      $state.go('productDetail', { id: product.slug });
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
