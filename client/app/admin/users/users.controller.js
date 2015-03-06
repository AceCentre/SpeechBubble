'use strict';

angular.module('speechBubbleApp')
  .controller('AdminUsersCtrl', function ($scope, $modal, Auth, User, Modal) {

    $scope.endpoint = '/api/users/:id';

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
            return $scope.items;
          }
        }
      });
    };

    $scope['delete'] = Modal.confirm['delete'](function(user) { // callback when modal is confirmed
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.items.splice(i, 1);
        }
      });
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
