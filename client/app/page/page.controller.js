'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function ($scope, Page, $stateParams, $location, $sce) {
    var slug = $stateParams.path.substring(1, $stateParams.path.length - 1);
    Page.get({ id: slug }, function(res) {
      $scope.content = $sce.trustAsHtml(res.revision.content);
      $scope.comments = res.comments;
    }, function() {
      $location.path('/404/').replace();
    });
  });
