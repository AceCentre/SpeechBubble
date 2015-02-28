'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function ($scope, Page, $stateParams, $location, $sce) {
    Page.get({ id: $stateParams.path.split('/').join('') }, function(res) {
<<<<<<< HEAD
      $scope.content = $sce.trustAsHtml(res.content);
      $scope.enableComments = res.enableComments;
=======
      $scope.content = res.content;
      $scope.comments = res.comments;
>>>>>>> feature/flat-pages
    }, function() {
      $location.path('/404/').replace();
    });
  });
