'use strict';

angular.module('speechBubbleApp')
.controller('AdminSupplierEditCtrl', function($scope, $modalInstance, Supplier, growl, supplier, suppliers) {

  $scope.supplier = supplier;
  $scope.regions = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];;

  $scope.addLocation = function(form) {
    form.$setSubmitted();
    if(form.$valid) {
      if(!$scope.supplier.locations) {
        $scope.supplier.locations = [];
      }
      $scope.supplier.locations.push($scope.location);
      $scope.location = {};
      form.$setPristine();
    }
  };

  $scope.deleteLocation = function(loc) {
    var i = $scope.supplier.locations.indexOf(loc);
    if(i !== -1) {
      $scope.supplier.locations.splice(i, 1);
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      if(supplier._id) {
        Supplier.update($scope.supplier,
          function(res) {
            angular.copy(res, supplier);
            $modalInstance.close();
            growl.success('Supplier updated.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      } else {
        Supplier.create($scope.supplier,
          function(res) {
            angular.copy(res, supplier);
            $modalInstance.close();
            growl.success('Supplier created.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      }
    }
  };

});
