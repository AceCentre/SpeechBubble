'use strict';

angular.module('speechBubbleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/contact/contact.html',
        controller: 'ContactCtrl'
      })
      .state('contact_success', {
        url: '/contact/success',
        templateUrl: 'app/contact/contact-success.html'
      })
      .state('contact_failure', {
        url: '/contact/failure',
        templateUrl: 'app/contact/contact-failure.html'
      });
  });
