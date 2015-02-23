'use strict';

angular.module('speechBubbleApp')
  .factory('Page', function ($resource) {

    return $resource('/api/page/:id', { id: '@_id' }, {
      'get': {
        method:'GET',
        params: {
          id: 'id'
        }
      },
      'save':   {method:'POST'},
      'query':  {method:'GET', isArray:true},
      'delete': {method:'DELETE'},
      'update': {method: 'PUT'}
    });

  });
