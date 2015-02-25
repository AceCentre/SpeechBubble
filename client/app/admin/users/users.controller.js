'use strict';

angular.module('speechBubbleApp')
  .controller('AdminUsersCtrl', function ($scope, $modal, Auth, User, Modal, filterFilter) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.filteredUsers = $scope.users;
    $scope.roles = ['admin', 'user'];
    $scope.itemsPerPage = 10;
    $scope.totalItems = 0;
    $scope.currentPage = 1;

    $scope.searchText = ''; // text in search input

    $scope.modal = function(user) {

      $modal.open({
        templateUrl: 'app/admin/users/modal.html',
        size: 'lg',
        controller: 'AdminUserModalCtrl',
        resolve: {
          currentUser: function() {
            return user
          },
          users: function() {
            return $scope.users;
          }
        }
      });
    };

    $scope.search = function() {
      $scope.currentPage = 1;
      $scope.filteredUsers = filterFilter($scope.users, $scope.searchText);
      $scope.totalItems = $scope.filteredUsers.length;
    };

    $scope.cancel = function() {
      $scope.searchText = '';
      $scope.search();
    };

    $scope['delete'] = Modal.confirm['delete'](function(user) { // callback when modal is confirmed
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    });

    $scope.$watchCollection('users', function() {
      $scope.totalItems = $scope.users.length;
    });

  });

  angular.module('speechBubbleApp')
    .controller('AdminUserModalCtrl', function($scope, User, $modalInstance, currentUser, users) {

      $scope.roles = ['admin', 'user'];
      $scope.currentUser = new User(currentUser);
      $scope.submitted = false;

      $scope.save = function(form) {
        $scope.submitted = true;
        // If we pass a currentUser we are editing therefore we should PUT not POST
        if(form.$valid) {
          if(currentUser) {
            User.updateUser($scope.currentUser, function() {
              angular.copy($scope.currentUser, currentUser);
              $modalInstance.close();
            });
          } else {
            $scope.currentUser.$save(function() {
              users.push($scope.currentUser);
              $modalInstance.close();
            });
          }
        }
      };

      $scope.cancel = function() {
        $modalInstance.dismiss();
      };

    });
