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
        { 'title': 'Browse All', 'link': '/products' },
        { 'title': 'Low-tech solutions', 'link': '/products?type=ProductLowTech'},
        { 'title': 'Hardware solutions', 'link': '/products?type=ProductHardware'},
        { 'title': 'Access solutions', 'link': '/products?type=ProductAccessSolution'},
        { 'title': 'Suppliers', 'link': '/suppliers' }
      ]
    }, {
      'title': 'Help',
      'children': [
        { 'title': 'About', 'link': '/about' },
        { 'title': 'Glossary', 'link': '/glossary' },
        { 'title': 'Contact', 'link': '/contact' }
      ]
    }];

    $scope.accountMenu = [
      { 'title': 'Account details', 'link': '/account/edit' },
      { 'title': 'Change password', 'link': '/account/change-password' }
    ];

    $scope.adminMenu = [
      { 'title': 'User Admin', 'link': '/admin/users' },
      { 'title': 'Product Admin', 'link': '/admin/products' },
      { 'title': 'Supplier Admin', 'link': '/admin/suppliers' },
      { 'title': 'Rating Admin', link: '/admin/ratings' },
      { 'title': 'Page Admin', 'link': '/admin/pages' },
      { 'title': 'Glossary Admin', 'link': '/admin/glossary' },
      { 'title': 'File Admin', 'link': '/admin/upload' }
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
