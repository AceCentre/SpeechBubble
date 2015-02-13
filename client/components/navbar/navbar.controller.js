'use strict';

angular.module('speechBubbleApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Support us',
      'children': [
        { 'title': 'Donate', 'link': 'https://www.justgiving.com/acecentre/' }
      ]
    }, {
      'title': 'Contact',
      'link': '/contact'
    }];

    $scope.accountMenu = [
      { 'title': 'Account details', 'link': '/account/details' },
      { 'title': 'Change password', 'link': '/account/change_password' }
    ];

    $scope.adminMenu = [
      { 'title': 'User moderation', 'link': '/admin/users' },
      { 'title': 'Product moderation', 'link': '/admin/products' },
    ];

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
