'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function ($scope, Page, $stateParams, $location, $sce) {
    var slug = $stateParams.path.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    Page.get({ id: slug }, function(res) {
      $scope.content = $sce.trustAsHtml(res.content);
      $scope.comments = res.comments;
    }, function() {
      $location.path('/404/').replace();
    });
  });
