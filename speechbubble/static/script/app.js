angular.module('speechBubble', ["checklist-model", "ui.bootstrap", 'angular-flash.service', 'angular-flash.flash-alert-directive', 'dialogs.main', 'pascalprecht.translate'])
    .config(function (flashProvider) {
        flashProvider.errorClassnames.push('alert-danger');
    })
    .factory('dataFactory', ['$http', function($http){
        var urlBase = "/api/";
        var dataFactory = {};

        dataFactory.createItem = function(data){
            return $http.post(urlBase+"product/create", data);
        };

        dataFactory.saveDraft = function(itemId, userId, data){
            return $http.put(urlBase+"product/"+itemId+"/"+userId, data);
        };

        dataFactory.deleteDraft = function(itemId, userId){
            return $http.delete(urlBase+"product/"+itemId+"/"+userId);
        };

        dataFactory.getDraft = function(itemId, userId){
            return $http.get(urlBase+"product/"+itemId+"/"+userId);
        };

        dataFactory.getOrCreateDraft = function(itemId, userId){
            return $http.post(urlBase+"product/"+itemId+"/"+userId);
        };

        dataFactory.moderationRequest = function(itemId, userId, data){
            return $http.post(urlBase+"moderation/create/"+itemId+"/"+userId, data);
        };

        dataFactory.moderationAction = function(modId, action){
            return $http.post(urlBase+"moderation/"+modId+"/"+action)
        };

        return dataFactory;
    }])
    .controller('EditFormCtrl', ["$scope", "$window", "dataFactory", "flash", "dialogs", function($scope, $window, dataFactory, flash, dialogs) {

		$scope.lang = 'en-US';
		$scope.language = 'English';

        // $translate.use($scope.lang);
        // TODO - get angular translate working properly for dialog buttons

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
                    $window.location.href = "/edit/" + data.id;
                }
            });
        };

        $scope.save = function(){
            response = dataFactory.saveDraft($scope.itemId, $scope.userId, $scope.form_data);

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
        };

        $scope.publishRequest = function(){
            response = dataFactory.moderationRequest($scope.itemId, $scope.userId, $scope.form_data);

            response.success(function(data, status){
                $scope.field_errors = {};

                if(data.failed){
                    flash.error = data.failed;
                }
                else if(data.errors){
                    $scope.field_errors = data.errors;
                    flash.error = "Unable to finalise document - please correct the form errors and try again."
                }
                else{
                    flash.success = "Thanks. This draft will be reviewed by our moderators.";
                }
            });
        };

        $scope.delete = function(itemId, userId){
            var dlg = dialogs.confirm('Please Confirm', 'Are you sure you want to delete this draft?');

            dlg.result.then(function(btn){
			    dataFactory.deleteDraft($scope.itemId, $scope.userId).success(function(data){
                    $window.location = "/";
                });
			},function(btn){
			    // do nothing if user clicks 'no'
			});
        };

        $scope.load = function(itemId, userId){
            $scope.itemId = itemId;
            $scope.userId = userId;

            dataFactory.getDraft(itemId, userId).success(function(data){
                if(data.success){
                    $scope.form_data = data.data;
                    $scope.stats = data.stats;

                    if(data.moderation){
                        $scope.modId = data.moderation;
                    }
                    else{
                        $scope.modId = null;
                    }
                }
                else{
                    $window.location = "/";
                }
            });
        };

        $scope.moderation = function(action){
            dataFactory.moderationAction($scope.modId, action).success(function(data){

            });
        };
    }]);
