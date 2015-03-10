'use strict';

angular.module('speechBubbleApp')
  .factory('Product', function ($resource) {

    return $resource('/api/product/:id', { id: '@_id' }, {
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
  .factory('ProductOptions', function () {

    return {
      speech: [
        'Acapela',
        'AT&T',
        'Cepstral',
        'CereProc',
        'eSpeak',
        'Ekho',
        'Festival',
        'FreeTTS',
        'Ivona',
        'Neospeech',
        'Nuance Loquendo',
        'Nuance Vocalizer',
        'Praat',
        'Nuance SVOX'
      ]
    };

  });
