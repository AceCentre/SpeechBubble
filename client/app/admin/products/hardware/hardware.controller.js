'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductHardwareEditCtrl', function($scope, $modalInstance, Product, current, ProductOptions, ProductSelect2Options, growl) {

  $scope.product = current;
  $scope.devices = ProductOptions.devices;
  $scope.synthetisedSpeechOptions = ProductOptions.speech;
  $scope.select2VocabularyOptions = ProductSelect2Options.vocabulary;
  $scope.select2Options = ProductSelect2Options.supplier;

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.addMoreInformation = function(form) {
    if(form.$valid) {
      if(!$scope.product.features.moreInformationLinks) {
        $scope.product.features.moreInformationLinks = [];
      }
      $scope.product.features.moreInformationLinks.push({
        label: $scope.temp.moreInformationLabel,
        url: $scope.temp.moreInformationUrl
      });
      $scope.temp.moreInformationLabel = '';
      $scope.temp.moreInformationLabel = '';
    }
  };

});
