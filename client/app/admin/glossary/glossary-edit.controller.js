'use strict';

angular.module('speechBubbleApp')
  .controller('AdminGlossaryEditCtrl', function($scope, $modalInstance,  Glossary, growl, GlossaryItem) {
    $scope.isSaving = false;
    $scope.item = GlossaryItem;

    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $scope.isSaving = true;
        Glossary.update($scope.item, function(res) {
          $scope.isSaving = false;
          $modalInstance.close();
        }, function() {
          $scope.isSaving = false;
          growl.error('Could not create product.');
        });
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
