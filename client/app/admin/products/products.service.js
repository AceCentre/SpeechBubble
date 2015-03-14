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
  .factory('ProductTemplate', function() {
    return function(product) {
      var template;
      var controller;

      switch(product.type) {
        case 'ProductHardwareSimple':
          controller = 'AdminProductHardwareEditCtrl';
          template = 'app/admin/products/hardware/hardware-simple.html';
          break;
        case 'ProductHardwareAdvanced':
          controller = 'AdminProductHardwareEditCtrl';
          template = 'app/admin/products/hardware/hardware-advanced.html';
          break;
        case 'ProductSoftware':
          controller = 'AdminProductSoftwareEditCtrl';
          template = 'app/admin/products/software/software.html';
          break;
        case 'ProductVocabulary':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/vocabulary/vocabulary.html';
          break;
      }

      return {
        template: template,
        controller: controller
      };
    };
  })
  .factory('ProductOptions', function () {

    var suppliers = [];

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
      ],
      devices: [
        'Microsoft Windows XP',
        'Microsoft Windows 7',
        'Microsoft Windows 8',
        'Microsoft Windows 8 Pro',
        'Mac OS X 10.0 (Cheetah)',
        'Mac OS X 10.1 (Puma)',
        'Mac OS X 10.2 (Jaguar)',
        'Mac OS X 10.3 (Panther)',
        'Mac OS X 10.4 (Tiger)',
        'Mac OS X 10.5 (Leopard)',
        'Mac OS X 10.6 (Snow Leopard)',
        'Mac OS X 10.7 (Lion)',
        'Mac OS X 10.8 (Mountain Lion)',
        'Mac OS X 10.9 (Mavericks)',
        'Mac OS X 10.10 (Yosemite)',
        'Android 4.4 (KitKat)',
        'Android 4.3 (Jelly Bean)',
        'Android 4.2.x',
        'Android 4.1.x',
        'Android 4.0.3–4.0.4 (Ice Cream Sandwich)',
        'Android 2.3.3–2.3.7 (Gingerbread)',
        'Android 2.2 Froyo',
        'Microsoft Pocket PC 2000',
        'Microsfot Pocket PC 2002',
        'Microsoft Windows Mobile 2003',
        'Microsoft Windows Mobile 2003 SE',
        'Microsoft Windows Mobile 5.0',
        'Microsoft Windows Mobile 6',
        'Microsoft Windows Mobile 6.1',
        'Microsoft Windows Mobile 6.5',
        'Apple iOS 1',
        'Apple iOS 2',
        'Apple iOS 3',
        'Apple iOS 4',
        'Apple iOS 5',
        'Apple iOS 6',
        'Apple iOS 7',
        'Apple iOS 8'
      ]
    };

  });
