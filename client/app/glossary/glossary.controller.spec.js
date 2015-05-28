'use strict';

describe('Controller: GlossaryCtrl', function () {

  // load the controller's module
  beforeEach(module('speechBubbleApp'));

  var GlossaryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GlossaryCtrl = $controller('GlossaryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
