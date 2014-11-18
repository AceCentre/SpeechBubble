app.directive('sbConditionalRule', ['$parse', function($parse){
    return {
        restrict: "E",
        link: function(scope, element, attrs){

            if(!scope.product.form_data){
                scope.product.form_data = {}
            }

            if(!attrs.show || ! attrs.when || !attrs.is){
                throw "You must supply `show` and `when` and `is` attributes";
            }

            scope.display_rules[attrs.show] = [attrs.when, attrs.is];

            scope.$watch(
                "product.form_data."+attrs.when,
                function(newValue, oldValue){

                    var visible = true;
                    var value = angular.isArray(newValue) ? newValue : [newValue];

                    if(attrs.is.indexOf('[') !== -1){
                        // bit hacky - it'd be better if string values were
                        // quoted so that $eval doesn't attempt to find them
                        // on scope, and thus avoiding the above test.
                        var condition = scope.$eval(attrs.is);
                    }
                    else{
                       var condition = attrs.is;
                    }

                    if(angular.isArray(condition)){
                        visible = _.intersection(value, condition).length > 0;
                    }
                    else if(_.contains(["True", "False", condition])){
                        console.log('boolean comparison');
                    }
                    else{
                        visible = _.contains(value, condition);
                    }
                    scope.field_state[attrs.show] = visible;
                }, true
           );
        }
    }
}]);