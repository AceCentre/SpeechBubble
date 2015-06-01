'use strict';

angular.module('speechBubbleApp')
.controller('ProductSplitCtrl', function ($scope, $stateParams) {
  $scope.getProductUrl = function(rev) {
    return '/products/' + $stateParams.slug + '/' + $stateParams[rev];
  };
});
