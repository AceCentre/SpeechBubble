'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageEditCtrl', function($scope, $modalInstance, Page, pages, page, growl) {

    $scope.page = page;
    $scope.revisions = page._revisions.slice().reverse();
    $scope.revisionsPerPage = 5;
    $scope.currentPage = 1;

    $scope.current = {
      revision: page._revisions[page._revisions.length -1]
    };

    $scope.revert = function(revision) {
      $scope.current.revision.title = revision.title;
      $scope.current.revision.content = revision.content;
      $scope.current.revision.published = false;
      growl.warning('Set as current draft');
    };

    $scope.revisionLabel = function(revision) {
      var id = revision._id;
      var status = revision.published ? 'published' : 'draft';
      return id + ' (' + status + ')';
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

    $scope.update = function(message) {
      Page.update({
        _id: $scope.page._id,
        slug: $scope.page.slug,
        visible: $scope.page.visible,
        comments: $scope.page.comments,
        title: $scope.current.revision.title,
        content: $scope.current.revision.content,
        published: $scope.current.revision.published
      }, function(res, close) {
        if(message) {
          growl.success(message);
        }
        $modalInstance.close();
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.$watch('page.slug', function() {
      $scope.url = (window.location.origin + '/' + $scope.page.slug);
    });

  });
