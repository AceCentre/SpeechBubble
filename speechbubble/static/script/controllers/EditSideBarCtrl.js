app.controller('EditSideBarCtrl', ["$scope", "ProductDataService", function($scope, ProductData){

    $scope.product = ProductData;

    $scope.save = function(){
        ProductData.save();
    }

    $scope.publishRequest = function(){
        ProductData.publishRequest();
    }
}]);