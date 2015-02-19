'use strict';

describe('Controller: ActivateCtrl', function () {

  // load the controller's module
  beforeEach(module('speechBubbleApp'));

  var ActivateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivateCtrl = $controller('ActivateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
