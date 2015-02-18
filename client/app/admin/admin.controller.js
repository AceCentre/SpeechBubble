'use strict';

angular.module('speechBubbleApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Modal) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.roles = ['admin', 'user'];
    $scope.itemsPerPage = 10;
    $scope.totalItems = 0;
    $scope.currentPage = 1;

    $scope.searchText = ''; // text in search input
    $scope.textToFilter = '' // text to filter results by

    $scope.search = function() {
      $scope.textToFilter = $scope.searchText;
    };

    $scope.cancel = function() {
      $scope.textToFilter = $scope.searchText = '';
    };

    $scope['delete'] = Modal.confirm.delete(function(user) { // callback when modal is confirmed
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    });

    $scope.updateStatus = User.updateStatus;
    $scope.updateRole = User.updateRole;
    $scope.updateSubscription = User.updateSubscription;

    $scope.$watchCollection('users', function() {
      $scope.totalItems = $scope.users.length;
    });

  });
