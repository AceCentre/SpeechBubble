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
    .factory('ProductDataService', ['dataFactory', '$window', 'flash', function(dataFactory, $window, flash){
        var factory = {};

        // the form data
        factory.form_data = {};

        // conditional field rules
        factory.display_rules = {};

        // conditional fields that and their current display state
        factory.field_state = {};

        // field errors
        factory.field_errors = {};

        factory.save = function() {

            response = dataFactory.saveDraft(factory.itemId, factory.userId, factory.form_data);

            response.success(function (data, status) {
                factory.field_errors = {};
                if (data.errors) {
                    factory.field_errors = data.errors;
                }
                else {
                    factory.saved = data.success;
                    factory.stats = data.stats;
                    flash.success = "Saved!";
                }
            });
        }

        factory.load = function(itemId, userId){
            factory.itemId = itemId;
            factory.userId = userId;

            dataFactory.getDraft(itemId, userId).success(function(data){
                if(data.success){
                    factory.form_data = data.data;
                    factory.stats = data.stats;
                    console.log(data.moderation);
                    factory.isModerating = data.moderation ? true : false;
                }
                else{
                    $window.location = "/";
                }
            });
        };

        factory.publishRequest = function(){
            response = dataFactory.moderationRequest(factory.itemId, factory.userId, factory.form_data);

            console.log('=======================================');
            console.log(factory.form_data);

            response.success(function(data, status){
                factory.field_errors = {};

                if(data.failed){
                    flash.error = data.failed;
                }
                else if(data.errors){
                    factory.field_errors = data.errors;
                    console.log(data.errors);
                    flash.error = "Unable to finalise document - please correct the form errors and try again."
                }
                else{
                    flash.success = "Thanks. This draft will be reviewed by our moderators.";
                    factory.isModerating = true;
                }
            });
        };

        return factory;

    }])
    .controller('SupplierListCtrl', function($scope) {
        $scope.selectedRegions = [];
    })
    .controller('SupplierEditCtrl', function($scope){

    })
    .controller('EditSideBarCtrl', ["$scope", "ProductDataService", function($scope, ProductData){

        $scope.product = ProductData;

        $scope.save = function(){
            ProductData.save();
        }

        $scope.publishRequest = function(){
            ProductData.publishRequest();
        }
    }])
    .controller('EditFormCtrl', ["$scope", "$window", "dataFactory", "dialogs", "ProductDataService", function($scope, $window, dataFactory, dialogs,  ProductData) {

		$scope.lang = 'en-US';
		$scope.language = 'English';

        // $translate.use($scope.lang);
        // TODO - get angular translate working properly for dialog buttons

        // the form data
        $scope.form_data = ProductData.form_data;

        $scope.product = ProductData;

        // conditional field rules
        $scope.display_rules = {};

        // conditional fields that and their current display state
        $scope.field_state = {};

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

            console.log(ProductData);

            ProductData.load(itemId, userId);

            $scope.form_data = ProductData.form_data;
        };

        $scope.moderation = function(action){
            dataFactory.moderationAction($scope.modId, action).success(function(data){

            });
        };
    }]);
