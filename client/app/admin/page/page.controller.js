'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageCtrl', function ($scope, Page, $modal, Modal) {
    $scope.pages = Page.query();

    $scope.create = function() {
      $modal.open({
        templateUrl: 'app/admin/page/create.html',
        controller: 'AdminPageCreateCtrl',
        resolve: {
          pages: function() {
            return $scope.pages
          }
        }
      });
    };

    $scope.edit = function(page) {
      $modal.open({
        templateUrl: 'app/admin/page/edit.html',
        controller: 'AdminPageEditCtrl',
        size: 'lg',
        resolve: {
          pages: function() {
            return $scope.pages
          },
          page: function() {
            return page
          }
        }
      });
    };

    $scope['delete'] = Modal.confirm['delete'](function(page) { // callback when modal is confirmed
      Page.remove({ id: page._id });
      angular.forEach($scope.pages, function(p, i) {
        if (p === page) {
          $scope.pages.splice(i, 1);
        }
      });
    });

  });
