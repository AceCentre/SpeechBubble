'use strict';

angular.module('speechBubbleApp')
  .controller('AdminUsersCtrl', function ($scope, $location, $modal, Auth, User, Modal, growl) {

    $scope.limit = Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.term = $location.search().term;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;

    function updateResults() {
      $scope.skip = ($scope.page - 1) * $scope.limit;
      User.query({
        skip: $scope.skip,
        limit: $scope.limit,
        term: $location.search().term
      }, function(res) {
        $scope.users = res.users;
        $scope.total = res.total;
        $('html, body').stop().animate({ scrollTop: 0 }, 400);
      }, function(err) {
        growl.error('Sorry an error occured.');
      });
    }

    $scope.$watch('page', updateResults);

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

    $scope['delete'] = Modal.confirm['delete'](function(user) { // callback when modal is confirmed
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
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
