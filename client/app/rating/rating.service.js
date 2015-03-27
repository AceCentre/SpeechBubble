'use strict';

angular.module('speechBubbleApp')
.factory('Rating', function ($resource) {
  return $resource('/api/rating/:id', { id: '@_id' }, {
    'get': {
      method:'GET',
      params: {
        id: 'id'
      }
    },
    'create': { method: 'POST' },
    'update': { method: 'PUT' }
  });
});
