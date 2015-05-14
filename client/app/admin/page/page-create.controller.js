'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageCreateCtrl', function($scope, $modalInstance, Page, pages, growl) {
    $scope.isSaving = false;
    $scope.slug = '';

    $scope.create = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $scope.isSaving = true;
        Page.create({ slug: $scope.slug, note: 'initial' }, function(page) {
          $scope.isSaving = false;
          pages.push(page);
          $modalInstance.dismiss();
        }, function(res) {
          $scope.isSaving = false;
          switch(res.data.code) {
            case 11000:
              growl.error('A page already exists with that URL.');
              break;
            default:
              growl.error('Could not create page.');
          }
        });
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.$watch('slug', function() {
      $scope.url = (window.location.origin + '/' + $scope.slug);
    });

  });
