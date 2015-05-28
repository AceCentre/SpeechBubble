'use strict';

angular.module('speechBubbleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('glossary', {
        url: '/glossary',
        templateUrl: 'app/glossary/glossary.html',
        controller: 'GlossaryCtrl'
      });
  });