app.factory('ProductDataService', ['dataFactory', '$window', 'flash', function(dataFactory, $window, flash){
    var factory = {};

    // the form data
    factory.form_data = {};

    // conditional field rules
    factory.display_rules = {};

    // conditional fields that and their current display state
    factory.field_state = {};

    // field errors
    factory.field_errors = {};

    factory.save = function() {

        response = dataFactory.saveDraft(factory.itemId, factory.userId, factory.form_data);

        response.success(function (data, status) {
            factory.field_errors = {};
            if (data.errors) {
                factory.field_errors = data.errors;
            }
            else {
                factory.saved = data.success;
                factory.stats = data.stats;
                flash.success = "Saved!";
            }
        });
    }

    factory.load = function(itemId, userId){
        factory.itemId = itemId;
        factory.userId = userId;

        dataFactory.getDraft(itemId, userId).success(function(data){
            if(data.success){
                factory.form_data = data.data;
                factory.stats = data.stats;
                console.log(data.moderation);
                factory.isModerating = data.moderation ? true : false;
            }
            else{
                $window.location = "/";
            }
        });
    };

    factory.publishRequest = function(){
        response = dataFactory.moderationRequest(factory.itemId, factory.userId, factory.form_data);

        console.log('=======================================');
        console.log(factory.form_data);

        response.success(function(data, status){
            factory.field_errors = {};

            if(data.failed){
                flash.error = data.failed;
            }
            else if(data.errors){
                factory.field_errors = data.errors;
                console.log(data.errors);
                flash.error = "Unable to finalise document - please correct the form errors and try again."
            }
            else{
                flash.success = "Thanks. This draft will be reviewed by our moderators.";
                factory.isModerating = true;
            }
        });
    };

    return factory;

}]);