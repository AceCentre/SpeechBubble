'use strict';

angular.module('speechBubbleApp')
  .controller('AdminGlossaryCreateCtrl', function($scope, $modalInstance,  Glossary, growl, GlossaryEditorOptions) {
    $scope.isSaving = false;
    $scope.item = {};

    $scope.editorOptions = GlossaryEditorOptions;

    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $scope.isSaving = true;
        Glossary.create($scope.item, function(res) {
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
