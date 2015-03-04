'use strict';

angular.module('speechBubbleApp')
.controller('AdminSupplierEditCtrl', function($scope, $modalInstance, Supplier, growl, supplier, suppliers) {

  $scope.supplier = supplier;
  $scope.regions = ['UK', 'Europe', 'USA', 'Other'];

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      if(supplier._id) {
        Supplier.update($scope.supplier,
          function() {
            $modalInstance.close();
            growl.success('Supplier updated.');
          },
          function(res) {
            growl.error(res.error);
          });
      } else {
        Supplier.create($scope.supplier,
          function() {
            $modalInstance.close();
            growl.success('Supplier created.');
          },
          function(res) {
            growl.error(res.error);
          });
      }
    }
  };

});
