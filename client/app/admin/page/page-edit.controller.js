'use strict';

angular.module('speechBubbleApp')
  .controller('AdminPageEditCtrl', function($scope, $modalInstance, Page, pages, page) {

    $scope.page = page;
    $scope.revisions = page._revisions.slice().reverse();
    $scope.revision = page._revisions[page._revisions.length -1];

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

    $scope.update = function() {
      Page.update({
        _id: $scope.page._id,
        slug: $scope.page.slug,
        visible: $scope.page.visible,
        comments: $scope.page.comments,
        title: $scope.revision.title,
        content: $scope.revision.content,
        published: $scope.revision.published
      }, function(res) {
        $modalInstance.close(res);
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.$watch('page.slug', function() {
      $scope.url = (window.location.origin + '/' + $scope.page.slug);
    });

  });
