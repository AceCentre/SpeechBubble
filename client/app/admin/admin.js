'use strict';

angular.module('speechBubbleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin/users',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });
