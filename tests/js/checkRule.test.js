/*describe('Verify the display rules', function() {

    beforeEach(function (){
        module('speechBubble');

        inject(function($compile, $rootScope) {
              scope = $rootScope.$new();

              //get the jqLite or jQuery element
              elem = angular.element(html);

              //compile the element into a function to
              // process the view.
              compiled = $compile(elem);

              //run the compiled view.
              compiled(scope);

              //call digest on the scope!
              scope.$digest();
        });
    });

});*/

describe('Testing display rule functionality on edit controller', function(){
    var scope, controller;

    beforeEach(function () {
        module('speechBubble');
    });

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();

        scope.display_rules = {
            test_field_2: ['test_field_1', 'eq', 1],
            test_field_3: ['test_field_2', 'neq', 1],
            test_field_4: ['test_field_3', 'in', [1,2,3]]
        }

        scope.data = {
            test_field_1: 1,
            test_field_2: 1,
            test_field_3: [4,5,7]
        }

        controller = $controller('EditFormCtrl', {
            '$scope': scope
        });

        scope.$digest();
    }));

    it('test "eq"', function () {
        expect(scope._checkRule(['test_field_1', 'eq', 1])).toBe(true);
        expect(scope._checkRule(['test_field_1', 'eq', 2])).toBe(false);
    });

    it('test "neq"', function () {
        expect(scope._checkRule(['test_field_1', 'neq', 1])).toBe(false);
        expect(scope._checkRule(['test_field_1', 'neq', 2])).toBe(true);
    });

    it('test "in"', function () {
        expect(scope._checkRule(['test_field_1', 'in', [7,8,9]])).toBe(false);
        expect(scope._checkRule(['test_field_1', 'neq', [1,2,3]])).toBe(true);
    });
})