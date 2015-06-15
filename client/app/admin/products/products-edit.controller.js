'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductEditCtrl', function(Auth, $timeout, $filter, $rootScope, $window, $scope, $http, $modal, $modalInstance, Modal, $upload, Product, Supplier, current, ProductOptions, ProductImages, ProductVideos, ProductLinks, growl, localStorageService) {

    var isLatestRevision = function(item, revision) {
      var item = item || current;
      var revision = revision || item.currentRevision;
      if(!item.revisions.length) {
        return true;
      }
      if(item.revisions[item.revisions.length - 1]._id === revision) {
        return true;
      }
      return false;
    };

    var revertToLatestRevision = function(item) {
      $scope.revert(item.revisions[item.revisions.length - 1]);
    };

    // Current working product
    $scope.revisions = angular.copy(current.revisions);
    $scope.product = angular.copy(current);
    $scope.current = current;
    $scope.autoSave = localStorageService.get(current._id);
    $scope.isLatestRevision = isLatestRevision;

    $scope.isAdmin = Auth.isAdmin;
    $scope.isSaving = false;
    $scope.compare = {
      'rev1': '',
      'rev2': ''
    };

    // Product options
    $scope.devices = ProductOptions.devices;
    $scope.speechOptions = ProductOptions.speech;
    $scope.productLinks = ProductLinks($scope);
    $scope.supplierOptions = [];
    $scope.vocabularyOptions = [];
    $scope.deviceOptions = [];
    $scope.symbols = ProductOptions.symbols;

    // Add/remove media
    $scope.images = ProductImages($scope);
    $scope.videos = ProductVideos($scope);

    // Revision pagination
    $scope.revisionsPerPage = 5;
    $scope.currentPage = 1;

    function publishRevision(revision) {
      $scope.isSaving = true;
      $http.post('/api/product/publish/' + current._id + '/' + revision._id)
        .success(function(res) {
          $scope.isSaving = false;
          growl.success('Revision published.');
          $modalInstance.close(res);
          $rootScope.$broadcast('resultsUpdated');
        })
        .error(function(res) {
          $scope.isSaving = false;
          growl.error('Could not publish revision.');
        });
    }

    $scope.$watch('imagesToUpload', $scope.images.add);

    $scope.create = function() {
      var modalInstance = $modal.open({
        templateUrl: 'app/admin/products/create.html',
        controller: 'AdminProductCreateCtrl',
        backdrop: 'static',
        scope: (function() {
          var scope = $rootScope.$new();
          scope.product = {
            type: 'ProductVocabulary'
          };
          return scope;
        })()
      });
    };

    $scope.hasChanges = function() {
      var hasChanges = !angular.equals($scope.product, current);
      if($scope.currentRevision) {
        // Clone and remove properties not required for equality checking
        var currentRevision = angular.copy($scope.revisions[0]);
        var currentProduct = angular.copy($scope.product);
        delete currentProduct._id;
        delete currentProduct.__t;
        delete currentProduct.type;
        delete currentRevision._id;
        delete currentRevision.__t;
        hasChanges = !angular.equals(currentRevision, currentProduct);
      }
      return hasChanges;
    };

    $scope.getPublishMessage = function(rev) {
      return 'this draft (' + $filter('date')(rev.updatedAt, 'dd/MM/yyyy HH:mm:ss') + ')';
    };

    // Set product back to original product passed into controller
    $scope.reset = function() {
      $scope.product = current;
    };

    $scope.publish = Modal.confirm.submit(function(revision) { // callback when modal is confirmed
      publishRevision(revision);
    });

    $scope.save = function(form, publish) {
      $scope.submitted = true;
      if($scope.hasChanges()) {
        if(!form.$valid) {
          return growl.error('Form validation failure, please check your information.');
        }
        $scope.isSaving = true;
        
        Product.update($scope.product,
          function(res) {
            $scope.isSaving = false;
            localStorageService.remove(current._id);

            if(publish) {
              $scope.publish('the current draft', res.revisions[res.revisions.length - 1]);
            } else {
              current = res;
              $modalInstance.close(res);
              growl.success('Product updated.');
            }
          },
          function(res) {
            $scope.isSaving = false;
            growl.error('Product could not be saved.');
          });
      } else {
        growl.warning('No changes to be saved.');
      }
    };

    // Set current working draft to a revision
    $scope.revert = function(revision) {
      localStorageService.remove(current._id);
      $scope.currentRevision = angular.copy(revision);
      $scope.product = angular.copy(revision);
      $scope.product._id = current._id;
      $scope.product.currentRevision = $scope.product.currentRevision || revision._id;
      $scope.product.type = current.type;
      $timeout(function() {
        // workaround - ui-select clears suppliers after replacing parent
        $scope.product.suppliers = revision.suppliers;
      });
      if( isLatestRevision(current, revision) ) {
        growl.success('Set published version as working draft.', { 'ttl': 3000 });
      } else {
        growl.error('Set unpublished version as working draft.', { 'ttl': 5000 })
      }
    };

    $scope.refreshSuppliers = function(term) {
      Supplier.query({ term: term, limit: 0, skip: 0 }, function(res) {
        $scope.supplierOptions = res.items;
      });
    };

    $scope.refreshVocabularies = function(term) {
      Product.query({ type: 'ProductVocabulary', term: term, limit: 0, skip: 0 }, function(res) {
        $scope.vocabularyOptions = res.items;
      });
    };

    $scope.refreshDevices = function(term) {
      Product.query({ type: 'ProductHardware', term: term, limit: 0, skip: 0 }, function(res) {
        $scope.deviceOptions = res.items;
      });
    };

    $scope.$watch('product.features.dedicated', function() {
      $scope.refreshDevices();
    });

    $scope.cancel = function() {
      localStorageService.remove(current._id);
      $modalInstance.dismiss();
    };

    $scope.openSplitCompareWindow = function() {
      if($scope.compare.rev1 && $scope.compare.rev2) {
        return $window.open('/products/split/' + current.slug + '/' + $scope.compare.rev1 + '/' + $scope.compare.rev2);
      }
      growl.warning('select 2 revisions to compare.');
    };
    
    $scope.deleteRevision = Modal.confirm['delete'](function(rev, index) { // callback when modal is confirmed
      $http({
        'method': 'DELETE',
        'url': '/api/product/' + $scope.product._id + '/' + rev._id
      })
      .success(function() {
        $scope.revisions.splice(index, 1);
      })
      .error(function() {
        growl.error('Could not delete version ' + rev._id);
      });
    });

    if($scope.autoSave) {
      growl.success('Restored product from auto-save.', { ttl: 5000 });
      $scope.product = $scope.autoSave;
    } else if( !isLatestRevision(current) ) {
      revertToLatestRevision(current);
    }

    $scope.$watch('product', function() {
      localStorageService.set(current._id, angular.copy($scope.product));
    }, true);

  });
