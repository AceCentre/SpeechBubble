'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function ($scope, Page, $stateParams, $location, $sce) {
    Page.get({ id: $stateParams.path.split('/').join('') }, function(res) {
      $scope.content = $sce.trustAsHtml(res.content);
      $scope.comments = res.comments;
    }, function() {
      $location.path('/404/').replace();
    });
  });
