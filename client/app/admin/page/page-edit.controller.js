'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageEditCtrl', function($scope, $modalInstance, Page, pages, page) {

    if(!page._revisions.length) {
      page._revisions.push({});
    }

    $scope.page = page;
    $scope.revision = page._revisions[0];

    $scope.options = {
      visibility: ['hidden', 'public'],
      status: ['draft', 'published']
    };

    $scope.update = function() {
      Page.update({
        _id: $scope.page._id,
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

    $scope.$watch('page.slug', function() {
      $scope.url = (window.location.origin + '/' + $scope.page.slug);
    });

  });
