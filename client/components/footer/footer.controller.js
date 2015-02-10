'use strict';

angular.module('speechBubbleApp')
  .controller('FooterCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Contact',
      'link': '/contact'
    }, {
      'title': 'Site Map',
      'link': '/site-map'
    },{
      'title': 'Privacy Policy',
      'link': '/privacy'
    },{
      'title': 'Accessibility',
      'link': '/accessibility'
    }];
  });
