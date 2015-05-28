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
  })
  .factory('GlossaryEditorOptions', function() {
    return {
      toolbar: [
        ['Bold', 'Italic'],
        ['Link', 'Unlink', 'Anchor'],
        ['Source']
      ],
      extraAllowedContent: '*[id](*)'
    };
  })
