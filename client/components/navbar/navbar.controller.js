'use strict';

angular.module('speechBubbleApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Products',
      'children': [
        { 'title': 'Search', 'link': '/search' },
        { 'title': 'Browse', 'link': '/products' },
        { 'title': 'Suppliers', 'link': '/suppliers' }
      ]
    }, {
      'title': 'Help',
      'children': [
        { 'title': 'About', 'link': '/about' },
        { 'title': 'Contribute', 'link': '/contribute' },
        { 'title': 'Glossary', 'link': '/glossary' },
        { 'title': 'Feedback', 'link': '/feedback' },
        { 'title': 'Contact', 'link': '/contact' }
      ]
    }];

    $scope.accountMenu = [
      { 'title': 'Account details', 'link': '/account/edit' },
      { 'title': 'Change password', 'link': '/account/change-password' }
    ];

    $scope.adminMenu = [
      { 'title': 'User moderation', 'link': '/admin/users' },
      { 'title': 'Product moderation', 'link': '/admin/products' },
      { 'title': 'Supplier moderation', 'link': '/admin/suppliers' },
      { 'title': 'Rating moderation', link: '/admin/ratings' },
      { 'title': 'Page moderation', 'link': '/admin/pages' },
      { 'title': 'File administration', 'link': '/admin/upload' }
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
