'use strict';

angular.module('speechBubbleApp')
.controller('AdminSupplierEditCtrl', function($scope, $modalInstance, Supplier, growl, current, suppliers) {

  $scope.current = current;
  $scope.regions = ['UK', 'Europe', 'USA', 'Other'];

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      if(current._id) {
        Supplier.update($scope.current,
          function() {
            $modalInstance.close();
            growl.success('Supplier updated.');
          },
          function(res) {
            growl.error(res.error);
          });
      } else {
        Supplier.create($scope.current,
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
