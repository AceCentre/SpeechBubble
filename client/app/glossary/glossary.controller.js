'use strict';

angular.module('speechBubbleApp')
  .controller('GlossaryCtrl', function ($scope, $http, PageTitle) {
    PageTitle('Glossary');

    $http({
      'method': 'GET',
      'url': '/api/glossary'
    })
    .success(function(res) {
      $scope.total = res.total;
      $scope.items = res.items;
    });
  });
