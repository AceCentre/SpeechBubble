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

  .factory('ProductSearch', function($rootScope, $location) {
    var search = {};

    var get = function(){
      var location = $location.search();
      if(typeof location.facets === 'string') {
        location.facets = [location.facets];
      }
      angular.extend(search, location, { 'facets': {} });
      angular.forEach(search.facets, function(value, key) {
        delete search.facets[key];
      });
      angular.forEach(location.facets, function(value) {
        search.facets[value] = true;
      });
      search.page = Number(location.page || 1);
      search.limit = Number(location.limit || 10);
      search.type = location.type || '';
      search.term = location.term || '';
      return search;
    };

    get();

    $rootScope.$on('$locationChangeSuccess', get);

    return search;
  })

  .factory('ProductVideos', function($sce) {

    function getVideoId(url) {
      var videoId = url.split('v=')[1];
      var amp = videoId.indexOf('&');
      if(amp > -1) {
        videoId = videoId.substr(0, amp);
      }
      return videoId;
    }

    return function(scope) {
      return {
        add: function(url) {
          scope.product.videos.push({
            url: scope.temp.productVideoUrl,
            summary: scope.temp.productVideoSummary
          });
          scope.temp.productVideoUrl = scope.temp.productVideoSummary = '';
        },
        remove: function(index) {
          scope.product.videos.splice(index, 1);
        },
        getYoutubeUrl: function(url) {
          return $sce.trustAsResourceUrl('//youtube.com/embed/' + getVideoId(url));
        },
        getYoutubeThumbnail: function(url) {
          return $sce.trustAsResourceUrl('http://img.youtube.com/vi/' + getVideoId(url) + '/0.jpg');
        }
      };
    };
  })
  .factory('ProductImages', function($upload, $http, growl) {
    return function(scope) {
      return {
        add: function (files) {
          if (files && files.length) {
            files.forEach(function(file, i) {
              $upload.upload({
                url: '/api/product/upload/' + scope.product._id,
                file: file
              })
              .progress(function (evt) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
                file.name = evt.config.file.name;
              })
              .success(function (data, status, headers, config) {
                scope.product.images.push(data[data.length - 1]);
                file.complete = true;
              })
              .error(function(data, status, headers, config) {
                  growl.error('Image could not be uploaded.');
              });

            });
          }
        },
        remove: function(img) {
          var index = scope.product.images.indexOf(img);
          scope.product.images.splice(index, 1);

          $http['delete']('/api/product/upload/' + scope.product._id + '/' +  img._id)
          .success(function(data, status, headers, config) {
            // image already remove from array
          })
          .error(function(data, status, headers, config) {
            scope.product.images.push(img);
            growl.error('Image could not be deleted.');
          });
        }
      };
    };
  })
  .factory('FancyFacets', function() {
    return function(input) {
      var facets = [];

      var getFacets = function(value, key, parent) {
        parent = (parent && [parent, key].join('-')) || key;

        if(Object.prototype.toString.call(value) === '[object Object]') {
          for(var objKey in value) {
            if( value.hasOwnProperty(objKey) ) {
              getFacets(value[objKey], objKey, parent);
            }
          }
        }

        if(value === true || typeof value === 'string') {
          if(typeof value === 'string') {
            parent += (value.charAt(0).toUpperCase() + value.slice(1));
          }
          facets.push(parent.split(/(?=[A-Z])/).join('-').toLowerCase());
        }
      };

      for(var key in input) {
        if( input.hasOwnProperty(key) ) {
          getFacets(input[key], key);
        }
      }

      return facets;
    };
  })
  .factory('ProductCompareTemplate', function() {
    return function(product) {
      var template;
      var controller;

      switch(product.type) {
        case 'ProductHardware':
          controller = 'ProductsCompareCtrl';
          template = 'app/products/hardware/compare.html';
          break;
        case 'ProductAccessSolution':
          controller = 'ProductsCompareCtrl';
          template = 'app/products/access-solution/compare.html';
          break;
        case 'ProductSoftware':
          controller = 'ProductsCompareCtrl';
          template = 'app/products/software/compare.html';
          break;
        case 'ProductVocabulary':
          controller = 'ProductsCompareCtrl';
          template = 'app/products/vocabulary/compare.html';
          break;
        case 'ProductLowTech':
          controller = 'ProductsCompareCtrl';
          template = 'app/products/low-tech/compare.html';
          break;
      }

      return {
        template: template,
        controller: controller
      };
    };
  })
  .factory('ProductTemplate', function() {
    return function(product) {
      var template;
      var controller;

      switch(product.type) {
        case 'ProductHardware':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/hardware/hardware.html';
          break;
        case 'ProductAccessSolution':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/access-solution/access-solution.html';
          break;
        case 'ProductSoftware':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/software/software.html';
          break;
        case 'ProductVocabulary':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/vocabulary/vocabulary.html';
          break;
        case 'ProductLowTech':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/low-tech/low-tech.html';
          break;
      }

      return {
        template: template,
        controller: controller
      };
    };
  })
  // Provides generic add links functionality
  // must be provided a scope
  .factory('ProductLinks', function() {
    return function(scope) {
      return {
        add: function (id, form) {
          if (form.$valid) {
            scope.product.features = scope.product.features || {};
            scope.product.features[id] = scope.product.features[id] || [];

            var label = scope.temp[id + 'Label'];
            var url = scope.temp[id + 'Url'];

            scope.product.features[id].push({
              label: label,
              url: url
            });

            scope.temp[id + 'Label'] =  scope.temp[id + 'Url'] = '';
          }
        },
        delete: function (id, index) {
          scope.product.features[id].splice(index, 1);
        }
      };
    };
  })
  .factory('ProductOptions', function ($http) {

    var suppliers = [];
    var products = [];

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
        'Apple iOS 8',
        'Apple iPad',
        'Apple iPod',
        'Apple iPhone'
      ],
      symbols: [
        'PCS - Thinline',
        'PCS - Classic',
        'PCS - Persona',
        'PCS - High Contrast',
        'PCS - Animations',
        'Widgit - Standard',
        'Widgit - VI',
        'Snaps',
        'Makaton Signs and Symbols',
        'ARASAAC',
        'Mulberry',
        'SymbolStix',
        'Noun Project',
        'Pixon Pictures',
        'Minspeak icons',
        'Metacom',
        'Ablenet',
        'Smarty',
        'Other',
        'Bliss',
        'Dynasims',
        'Sclera'
      ],
      getHardwareProducts: function() {
        if(!products.length) {
          $http({
            'url': '/api/product/listHardware',
            'action': 'GET'
          })
          .success(function(res) {
            angular.copy(res, products);
          });
        }
        return products;
      }
    };

  });
