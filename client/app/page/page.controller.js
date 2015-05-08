'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function (PageTitle, $scope, Page, $stateParams, $location, $sce) {

    var slug;
    if(!$stateParams.path || $stateParams.path === '_=_') {
      slug = 'home';
    } else {
      slug = $stateParams.path.replace(/^\/|\/$/g, '').replace(/\s/g, '-');
    }

    Page.get({ id: slug }, function(res) {
      $scope.content = $sce.trustAsHtml(res.content);
      $scope.comments = res.comments;
      PageTitle(res.title);
    }, function() {
      PageTitle('Page not found');
      $location.path('/404/').replace();
    });
  });
