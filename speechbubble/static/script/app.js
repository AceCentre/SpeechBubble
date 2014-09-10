angular.module('speechBubble', ["checklist-model", "ui.bootstrap", 'angular-flash.service', 'angular-flash.flash-alert-directive'])
    .config(function (flashProvider) {
        flashProvider.errorClassnames.push('alert-danger');
    })
    .factory('dataFactory', ['$http', function($http){
        var urlBase = "/api/";
        var dataFactory = {};

        dataFactory.createItem = function(data){
            return $http.post(urlBase+"product/create", data);
        };

        dataFactory.saveItem = function(itemId, data){
            return $http.put(urlBase+"product/"+itemId, data);
        };

        dataFactory.getItem = function(itemId){
            return $http.get(urlBase+"product/"+itemId);
        };

        dataFactory.moderationRequest = function(itemId, data){
            return $http.post(urlBase+"moderation/"+itemId, data);
        };

        return dataFactory;
    }])
    .controller('EditFormCtrl', ["$scope", "$window", "dataFactory", "flash", function($scope, $window, dataFactory, flash) {

        // the form data
        $scope.form_data = {};

        // conditional field rules
        $scope.display_rules = {};

        // conditional fields that and their current display state
        $scope.field_state = {};

        // field errors
        $scope.field_errors = {};

        $scope.create = function(){
            response = dataFactory.createItem($scope.form_data);

            response.success(function(data, status) {
                if(data.errors) {
                    $scope.field_errors = data.errors;
                }
                else{
                    $window.location.href = "http://localhost:5000/edit/" + data.id;
                }
            });
        }

        $scope.save = function(){
            response = dataFactory.saveItem($scope.itemId, $scope.form_data);

            response.success(function(data, status){
                $scope.field_errors = {};
                if(data.errors){
                    $scope.field_errors = data.errors;
                }
                else{
                    $scope.saved = data.success;
                    $scope.stats = data.stats;
                    flash.success = "Saved!";
                }
            });
        }

        $scope.publishRequest = function(){
            response = dataFactory.moderationRequest($scope.itemId, $scope.form_data);

            response.success(function(data, status){
                $scope.field_errors = {};

                if(data.failed){
                    flash.error = data.failed;
                }
                else if(data.errors){
                    $scope.field_errors = data.errors;
                }
                else{
                    flash.success = "Thanks. Your moderation request has been received. We will email you when we have reviewed the listing";
                }
            });
        };

        $scope.load = function(itemId){
            $scope.itemId = itemId;

            dataFactory.getItem(itemId).success(function(data){
                $scope.form_data = data.data;
                $scope.stats = data.stats;
            });
        };
    }]);
