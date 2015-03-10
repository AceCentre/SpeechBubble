'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductEditCtrl', function($scope, $modalInstance, Product, ProductOptions, growl) {

  $scope.synthetisedSpeechOptions = ProductOptions.speech;

  function getResults(res) {
    return {
      results: res.items.map(function(item) {
        return {
          id: item._id,
          text: item.name
        }
      })
    }
  }

  $scope.select2VocabularyOptions = {
    multiple: true,
    ajax: {
      delay: 250,
      url: '/api/product/',
      data: function(term) {
        return {
          term: term,
          limit: 0,
          skip: 0,
          type: 'ProductVocabulary'
        }
      },
      results: getResults
    }
  };

  $scope.select2Options = {
    multiple: true,
    ajax: {
      delay: 250,
      url: '/api/supplier/',
      data: function(term) {
        return {
          term: term,
          limit: 0,
          skip: 0
        };
      },
      results: getResults
    }
  };

  $scope.addMoreInformation = function(form) {
    if(form.$valid) {
      if(!product.features.moreInformationLinks) {
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

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if($scope.product && form.$valid) {
      $scope.product.suppliers = $scope.selectedSuppliers.map(function(item) {
        return item.id;
      });
      if($scope.product._id) {
        Product.update($scope.product,
          function(res) {
            angular.copy(res, $scope.product);
            $modalInstance.close();
            growl.success('Product updated.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      } else {
        Product.create($scope.product,
          function(res) {
            angular.copy(res, $scope.product);
            $modalInstance.close();
            growl.success('Product created.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      }
    }
  };

});
