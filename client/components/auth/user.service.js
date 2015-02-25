'use strict';

angular.module('speechBubbleApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      updateUser: {method: 'PUT'},
      update: {
        method: 'PUT',
        params: {
          id:'me'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      activate: {
        method: 'GET',
        params: {
          id: 'activate'
        }
      }
	  });
  });
