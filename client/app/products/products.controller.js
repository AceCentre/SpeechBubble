'use strict';

angular.module('speechBubbleApp')

.controller('ProductsCtrl', function ($scope, $location, Auth, $modal, $rootScope, growl, ProductCompareTemplate) {
  $scope.endpoint = '/api/product/:id';
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.comparing = [];

  $scope.create = function() {
    var modalInstance = $modal.open({
      templateUrl: 'app/admin/products/create.html',
      controller: 'AdminProductCreateCtrl'
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
      return growl.warning('This product has already been selected.');
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
    return $scope.comparing.indexOf(product) !== -1;
  };

  $scope.canCompareProduct = function(product) {
    return $scope.comparing.length === 0 || ($scope.comparing[0].type === product.type);
  };
})

.controller('ProductDetailCtrl', function($state, $scope, $location, product, Rating, ProductTemplate, $modal, Auth) {
  $scope.isLoggedIn = Auth.isLoggedIn;

  $scope.product = product.data;
  $scope.comments = true;

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

  if($location.search().edit) {
    $scope.edit($scope.product);
  }

});
