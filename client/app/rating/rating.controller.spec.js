'use strict';

describe('Controller: RatingCtrl', function () {

  // load the controller's module
  beforeEach(module('speechBubbleApp'));

  var RatingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RatingCtrl = $controller('RatingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
