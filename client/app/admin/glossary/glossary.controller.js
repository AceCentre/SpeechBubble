'use strict';

angular.module('speechBubbleApp')
  .controller('AdminGlossaryCtrl', function ($rootScope, $scope, $modal, Auth, PageTitle) {

    PageTitle('Glossary Admin');
    $scope.isAdmin = Auth.isAdmin;
    $scope.endpoint = '/api/glossary/:id';

    $scope.create = function() {
      var modalInstance = $modal.open({
        templateUrl: 'app/admin/glossary/create.html',
        controller: 'AdminGlossaryCreateCtrl',
        backdrop: 'static'
      });

      modalInstance.result.then(function() {
        $rootScope.$broadcast('resultsUpdated');
      }, function() {
        $rootScope.$broadcast('resultsUpdated');
      });
    };

    $scope.edit = function(item) {
      var modalInstance = $modal.open({
        templateUrl: 'app/admin/glossary/create.html',
        controller: 'AdminGlossaryEditCtrl',
        backdrop: 'static',
        resolve: {
          'GlossaryItem': function() {
            return item;
          }
        }
      });

      modalInstance.result.then(function() {
        $rootScope.$broadcast('resultsUpdated');
      }, function() {
        $rootScope.$broadcast('resultsUpdated');
      });
    };

  });
