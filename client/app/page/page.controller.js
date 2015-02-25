'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function ($scope, Page, $stateParams, $location) {
    Page.get({ id: $stateParams.path.split('/').join('') }, function(res) {
      $scope.content = res.content;
      $scope.enableComments = res.enableComments;
    }, function() {
      $location.path('/404/');
    });
  });
