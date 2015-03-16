'use strict';

angular.module('speechBubbleApp')
  .controller('AdminUploadCtrl', function ($scope, $upload, $http, Modal) {
    $scope.$watch('filesToUpload', function () {
        $scope.upload($scope.filesToUpload);
    });

    $http.get('/api/upload').success(function(data) {
      $scope.files = data;
    });

    $scope['delete'] = Modal.confirm['delete'](function(file) { // callback when modal is confirmed
      $http['delete']('/api/upload/' + file).success(function() {
        angular.forEach($scope.files, function(f, i) {
          if (f.name === file) {
            $scope.files.splice(i, 1);
          }
        });
      });
    });

    $scope.upload = function (files) {
        if (files && files.length) {
          files.forEach(function(file, i) {
            $upload.upload({
                url: '/api/upload/',
                file: file
            }).progress(function (evt) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
                file.name = evt.config.file.name;
            }).success(function (data, status, headers, config) {
                $scope.files.push(data);
                file.complete = true;
            });
          });
        }
    };
  });
