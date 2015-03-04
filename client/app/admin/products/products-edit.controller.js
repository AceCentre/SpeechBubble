'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductEditCtrl', function($scope, $modalInstance) {

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
