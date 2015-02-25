'use strict';

angular.module('speechBubbleApp')
  .controller('AdminUploadCtrl', function ($scope, $upload, $http) {
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $http.get('/api/upload').success(function(data) {
      $scope.files = data;
    });

    $scope['delete'] = function(filename) {
      $http['delete']('/api/upload/' + filename).success(function() {
        angular.forEach($scope.files, function(f, i) {
          if (f === filename) {
            $scope.files.splice(i, 1);
          }
        });
      });
    }

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: '/api/upload/',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
  });
