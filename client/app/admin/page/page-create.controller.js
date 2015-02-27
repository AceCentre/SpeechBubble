'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageCreateCtrl', function($scope, $modalInstance, Page, pages) {

    $scope.create = function() {
      Page.create({ slug: $scope.slug }, function(page) {
        pages.push(page);
        $modalInstance.dismiss();
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
