'use strict';

angular.module('speechBubbleApp')
  .factory('Glossary', function ($resource) {
    return $resource('/api/glossary/:id', { id: '@_id' }, {
      'get': {
        method:'GET',
        params: {
          id: 'id'
        }
      },
      'create': { method: 'POST' },
      'query':  { method:'GET' },
      'delete': { method:'DELETE' },
      'update': { method: 'PUT' }
    });
  });
