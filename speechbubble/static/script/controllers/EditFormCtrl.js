app.controller('EditFormCtrl', ["$scope", "$window", "dataFactory", "dialogs", "ProductDataService", function($scope, $window, dataFactory, dialogs,  ProductData) {

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
                $scope.product.field_errors = data.errors;
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