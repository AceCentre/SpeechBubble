'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageEditCtrl', function($scope, $http, $rootScope, Auth, $modalInstance, Modal, Page, pages, page, growl) {

    $scope.isAdmin = Auth.isAdmin;
    $scope.page = page;
    $scope.revisionsPerPage = 5;
    $scope.currentPage = 1;

    function publishRevision(revision) {
      $http.post('/api/page/publish/' + page._id + '/' + revision)
        .success(function(res) {
          growl.success('Revision ' + revision + ' published.');
          $modalInstance.close();
          $rootScope.$broadcast('resultsUpdated');
        })
        .error(function(res) {
          growl.error('Could not publish revision.');
        });
    }

    function updateRevisions() {
      $http.get('/api/page/' + page._id + '/revisions')
        .success(function(res) {
          $scope.revisions = res;
        })
        .error(function(res) {
          growl.error('Could not fetch revisions.');
        });
    }

    updateRevisions();

    $scope.publish = Modal.confirm.submit(function(revision) { // callback when modal is confirmed
      publishRevision(revision);
    });

    // Set current working draft to a revision
    $scope.revert = function(revision) {
      $scope.page = angular.copy(revision);
      $scope.page._id = page._id;
      $scope.currentRevision = revision._id;
      $scope.page.visible = $scope.page.visible || false;
      $scope.page.comments = $scope.page.comments || false;
      growl.warning('Set as working draft.');
    };

    $scope.editorOptions = {
      toolbar: [
        ['Format', 'Bold', 'Italic'],
        ['Link', 'Unlink'],
        ['NumberedList', 'BulletedList'],
        ['Indent', 'Outdent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Table', 'Image', 'HorizontalRule'],
        ['Source']
      ],
      extraPlugins: "imagebrowser",
      imageBrowser_listUrl: "/api/upload/"
    };

    $scope.update = function(form, message) {
      $scope.submitted = true;
      if(form.$valid) {
        Page.update($scope.page, function(res, close) {
          if($scope.shouldPublish) {
            $scope.publish('the current draft', res._revisions[res._revisions.length - 1]);
            $scope.shouldPublish = false;
          } else {
            growl.success('Page updated.');
            $modalInstance.close();
          }
        }, function() {
          growl.error('Page could not be saved.');
        });
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.$watch('page.slug', function() {
      $scope.url = (window.location.origin + '/' + $scope.page.slug);
    });

  });
