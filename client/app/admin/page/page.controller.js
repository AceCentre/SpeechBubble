'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageCtrl', function ($scope, Page, $modal, Modal) {
    $scope.pages = Page.query();

    $scope.modal = function(page) {
      $modal.open({
        templateUrl: 'app/admin/page/modal.html',
        size: 'lg',
        controller: 'AdminPageModalCtrl',
        resolve: {
          currentPage: function() {
            return page
          },
          pages: function() {
            return $scope.pages;
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

angular.module('speechBubbleApp')
  .controller('AdminPageModalCtrl', function($scope, Page, $modalInstance, currentPage, pages) {
    $scope.currentPage = new Page(currentPage);

    $scope.save = function() {
      // If we pass a currentPage we are editing therefore we should PUT not POST
      if(currentPage) {
        Page.update($scope.currentPage, function() {
          angular.copy($scope.currentPage, currentPage);
          $modalInstance.close();
        });
      } else {
        $scope.currentPage.$save(function() {
          pages.push($scope.currentPage);
          $modalInstance.close();
        });
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
