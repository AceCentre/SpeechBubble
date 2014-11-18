app.factory('dataFactory', ['$http', function($http){
    var urlBase = "/api/";
    var dataFactory = {};

    dataFactory.createItem = function(data){
        return $http.post(urlBase+"product/create", data);
    };

    dataFactory.saveDraft = function(itemId, userId, data){
        return $http.put(urlBase+"product/"+itemId+"/"+userId, data);
    };

    dataFactory.deleteDraft = function(itemId, userId){
        return $http.delete(urlBase+"product/"+itemId+"/"+userId);
    };

    dataFactory.getDraft = function(itemId, userId){
        return $http.get(urlBase+"product/"+itemId+"/"+userId);
    };

    dataFactory.getOrCreateDraft = function(itemId, userId){
        return $http.post(urlBase+"product/"+itemId+"/"+userId);
    };

    dataFactory.moderationRequest = function(itemId, userId, data){
        return $http.post(urlBase+"moderation/create/"+itemId+"/"+userId, data);
    };

    dataFactory.moderationAction = function(modId, action){
        return $http.post(urlBase+"moderation/"+modId+"/"+action)
    };

    return dataFactory;
}]);