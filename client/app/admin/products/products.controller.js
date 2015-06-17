'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductsCtrl', function ($rootScope, $location, $http, $scope, $modal, Auth, ProductTemplate, ProductOptions, ProductSearch, PageTitle) {

    PageTitle('Product Search Admin');
    $scope.isAdmin = Auth.isAdmin;
    $scope.endpoint = '/api/product/:id';
    $scope.devices = ProductOptions.devices;
    $scope.search = ProductSearch;

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

    $scope.importAppsForAAC = function() {
      $http.get('/api/imports/appsforaac');
    };

    $scope.updateSlugs = function() {
      $http.get('/api/product/slugify');
    };

    $scope.performSearch = function() {
      $rootScope.$broadcast('resultsUpdated');
    };
    
    // Clear search filters when type is changed
    $scope.clearSearchRetainType = function() {
      angular.forEach($scope.search, function(value, key) {
        if(key !== 'term' && key !== 'type') {
          delete $scope.search[key];
        }
      });
    };

    $scope.clearFilters = function() {
      angular.forEach($scope.search, function(value, key) {
        if(key !== 'term') {
          delete $scope.search[key];
        }
      });
      $scope.search.type = '';
      $scope.performSearch();
    };

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

      modalInstance.result.then(function(product) {
        $rootScope.$broadcast('resultsUpdated');
      }, function() {
        $rootScope.$broadcast('resultsUpdated');
      });
    };

  });
