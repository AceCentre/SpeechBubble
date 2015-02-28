'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageEditCtrl', function($scope, $modalInstance, Page, pages, page) {

    $scope.page = page;
    $scope.revision = page._revisions[0] || {};

    $scope.options = {
      visibility: ['hidden', 'public'],
      status: ['draft', 'published']
    };

    $scope.update = function() {
      Page.update({
        slug: $scope.page.slug,
        comments: $scope.page.comments,
        registration: $scope.page.registration,
        title: $scope.revision.title,
        content: $scope.revision.content,
        status: $scope.revision.status
      }, function(res) {
        angular.copy(page, res);
        $modalInstance.dismiss();
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
