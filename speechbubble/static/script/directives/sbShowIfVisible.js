app.directive("sbShowIfVisible", ['$parse', function($parse) {
    return {
        link: function(scope, element, attrs){
            
            var field = attrs['sbShowIfVisible'];

            if(scope.field_state[field] === undefined){
                scope.field_state[field] = "";
            }

            scope.$watch('field_state.'+field, function(newData, oldData){
                element.css('display', (newData ? "block": "none"));
            })
        }
    }
}]);