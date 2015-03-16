'use strict';

describe('Controller: SupplierCtrl', function () {

  // load the controller's module
  beforeEach(module('speechBubbleApp'));

  var SupplierCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SupplierCtrl = $controller('SupplierCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
