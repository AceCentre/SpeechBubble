'use strict';

angular.module('speechBubbleApp')
.controller('AdminSupplierEditCtrl', function($scope, $modalInstance, Supplier, growl, supplier, suppliers) {

  $scope.supplier = supplier;
  $scope.regions = ['UK', 'Europe', 'USA', 'Other'];

  $scope.addLocation = function(form) {
    form.$setSubmitted();
    if(form.$valid) {
      if(!$scope.supplier.locations) {
        $scope.supplier.locations = [];
      }
      $scope.supplier.locations.push($scope.location);
      $scope.location = {};
      form.$setPristine();
    }
  };

  $scope.deleteLocation = function(loc) {
    var i = $scope.supplier.locations.indexOf(loc);
    if(i !== -1) {
      $scope.supplier.locations.splice(i, 1);
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      if(supplier._id) {
        Supplier.update($scope.supplier,
          function(res) {
            angular.copy(res, supplier);
            $modalInstance.close();
            growl.success('Supplier updated.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      } else {
        Supplier.create($scope.supplier,
          function(res) {
            angular.copy(res, supplier);
            $modalInstance.close();
            growl.success('Supplier created.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      }
    }
  };

});
