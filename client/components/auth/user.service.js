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
      updateStatus: {
        method: 'PUT',
        params: {
          id: 'updateStatus'
        }
      },
      updateRole: {
        method: 'PUT',
        params: {
          id: 'updateRole'
        }
      },
      updateSubscription: {
        method: 'PUT',
        params: {
          id: 'updateSubscription'
        }
      },
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
      }
	  });
  });
