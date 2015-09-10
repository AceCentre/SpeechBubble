'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageEditCtrl', function($scope, $http, $rootScope, $filter, Auth, $modalInstance, Modal, Page, pages, page, growl) {

    $scope.isAdmin = Auth.isAdmin;
    $scope.page = page;
    $scope.revisionsPerPage = 5;
    $scope.currentPage = 1;
    $scope.isSaving = false;

    function publishRevision(revision) {
      $scope.isSaving = true;
      $http.post('/api/page/publish/' + page._id + '/' + revision._id)
        .success(function(res) {
          $scope.isSaving = false;
          growl.success('Version published.');
          $modalInstance.close();
          $rootScope.$broadcast('resultsUpdated');
        })
        .error(function(res) {
          growl.error('Could not publish version.');
          $scope.isSaving = false;
        });
    }

    function updateRevisions() {
      $http.get('/api/page/' + page._id + '/revisions')
        .success(function(res) {
          $scope.revisions = res;
        })
        .error(function(res) {
          growl.error('Could not fetch versions.');
        });
    }

    updateRevisions();

    $scope.getPublishMessage = function(rev) {
      return 'this draft (' + $filter('date')(rev.updatedAt, 'dd/MM/yyyy HH:mm:ss') + ')';
    };

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
        ['Link', 'Unlink', 'Anchor'],
        ['NumberedList', 'BulletedList'],
        ['Indent', 'Outdent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Table', 'Image', 'HorizontalRule'],
        ['Source']
      ],
      extraPlugins: "imagebrowser",
      imageBrowser_listUrl: "/api/upload/",
      extraAllowedContent: '*[id](*)'
    };

    $scope.save = function(form, publish) {
      $scope.submitted = true;
      $scope.isSaving = true;
      if(form.$valid) {
        Page.update($scope.page, function(res, close) {
          if(publish) {
            $scope.publish('the current draft', res.revisions[res.revisions.length - 1]);
          } else {
            growl.success('Page updated.');
            $modalInstance.close();
          }
          $scope.isSaving = false;
        }, function() {
          $scope.isSaving = false;
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
