'use strict';

angular.module('speechBubbleApp')
  .config(function ($stateProvider) {
    $stateProvider.state('otherwise', {
        url: '*path',
        templateUrl: 'app/page/page.html',
        controller: 'PageCtrl'
    });

});
