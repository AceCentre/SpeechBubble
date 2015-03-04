'use strict';

angular.module('speechBubbleApp')
  .factory('Supplier', function ($resource) {

    return $resource('/api/page/:id', { id: '@_id' }, {
      'get': {
        method:'GET',
        params: {
          id: 'id'
        }
      },
      'create': { method: 'POST' },
      'query':  { method:'GET', isArray:true },
      'delete': { method:'DELETE' },
      'update': { method: 'PUT' }
    });

  });
