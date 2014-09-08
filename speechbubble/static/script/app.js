angular.module('speechBubble', ["checklist-model"])
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

        return dataFactory;
    }])
    .controller('EditFormCtrl', ["$scope", "$window", "dataFactory", function($scope, $window, dataFactory) {

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
                    //$window.location.reload();
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
                    alert('saved!');
                }
            });
        }

        $scope.load = function(itemId){
            $scope.itemId = itemId;

            dataFactory.getItem(itemId).success(function(data){
                $scope.form_data = data;
            });
        };

    }]);
