'use strict';

angular.module('speechBubbleApp')
  .controller('PageCtrl', function (PageTitle, $scope, Page, $state, $stateParams, $location, $sce) {
    var slug;

    if(!$stateParams.path) {
      slug = 'home';
    } else {
      // workaround for facebook apending _=_ to url
      if( $stateParams.path.indexOf('_=_') > -1 ) {
        return $state.go('main');
      } else {
        slug = $stateParams.path.replace(/^\/|\/$/g, '').replace(/\s/g, '-');
      }
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
