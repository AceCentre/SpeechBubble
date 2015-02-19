'use strict';

angular.module('speechBubbleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/account/change-password',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('edit', {
        url: '/account/edit',
        templateUrl: 'app/account/edit/edit.html',
        controller: 'EditCtrl'
      })
      .state('activate', {
        url: '/account/activate/:id',
        templateUrl: 'app/account/activate/activate.html',
        controller: 'ActivateCtrl'
      });
  });
