'use strict';

angular.module('speechBubbleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/admin/users',
        templateUrl: 'app/admin/users/users.html',
        controller: 'AdminUsersCtrl',
        authenticate: true
      })
      .state('pages', {
        url: '/admin/pages',
        templateUrl: 'app/admin/page/page.html',
        controller: 'AdminPageCtrl',
        authenticate: true
      })
      .state('upload', {
        url: '/admin/upload',
        templateUrl: 'app/admin/upload/upload.html',
        controller: 'AdminUploadCtrl',
        authenticate: true
      });
  });
