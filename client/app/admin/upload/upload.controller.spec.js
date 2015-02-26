'use strict';

describe('Controller: UploadCtrl', function () {

  // load the controller's module
  beforeEach(module('speechBubbleApp'));

  var UploadCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadCtrl = $controller('UploadCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
