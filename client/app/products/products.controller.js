'use strict';

angular.module('speechBubbleApp')
.controller('ProductsCtrl', function ($scope) {
  $scope.endpoint = '/api/product/:id';
});
