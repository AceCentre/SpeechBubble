'use strict';

angular.module('speechBubbleApp')
  .controller('FooterCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Contact',
      'link': '/contact'
    }, {
      'title': 'Privacy Policy',
      'link': '/privacy'
    }];
  });
