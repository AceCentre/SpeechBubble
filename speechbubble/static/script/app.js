angular.module('speechBubble', ["checklist-model"])
    .factory('dataFactory', ['$http', function($http){
        var urlBase = "/api/";
        var dataFactory = {};

        dataFactory.createItem = function(){

        };

        dataFactory.saveItem = function(){

        };

        dataFactory.getItem = function(itemId){

        };
    }])
    .controller('EditFormCtrl', function($scope, dataFactory) {

        // the form data
        $scope.form_data = {};

        // conditional field rules
        $scope.display_rules = {};

        // conditional fields that and their current display state
        $scope.field_state = {};
    });
