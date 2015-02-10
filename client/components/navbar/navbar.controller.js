'use strict';

angular.module('speechBubbleApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Menu 1',
      'link': '/menu',
      'children': [
        { 'title': 'link 1', 'link': '/menu/link1' },
        { 'title': 'link 2', 'link': '/menu/link2' },
        { 'title': 'link 3', 'link': '/menu/link3' },
        { 'title': 'link 4', 'link': '/menu/link4' }
      ]
    }];

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
