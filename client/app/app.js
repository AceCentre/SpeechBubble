'use strict';

angular.module('speechBubbleApp', [
  'ngAria',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngCkeditor',
  'angularFileUpload',
  'angular-growl',
  'frapontillo.bootstrap-switch',
  'ui.select',
  'angular.filter',
  'LocalStorageModule'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, growlProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    growlProvider.globalTimeToLive({success: 2000, error: 5000, warning: 2000, info: 2000});

    // Prevent caching
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    /**
     * Routes
     */
    $stateProvider

    // Main
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'PageCtrl'
    })

    .state('main_search', {
      url: '/search',
      templateUrl: 'app/main/main-search.html',
      controller: 'PageCtrl'
    })

    // Contact
    .state('contact', {
      url: '/contact',
      templateUrl: 'app/contact/contact.html',
      controller: 'ContactCtrl'
    })
    .state('contact_success', {
      url: '/contact/success',
      templateUrl: 'app/contact/contact-success.html'
    })
    .state('contact_failure', {
      url: '/contact/failure',
      templateUrl: 'app/contact/contact-failure.html'
    })

    // Supplier
    .state('suppliers', {
      url: '/suppliers',
      templateUrl: 'app/supplier/supplier.html',
      controller: 'SupplierCtrl'
    })
    .state('supplierDetail', {
      url: '/suppliers/:id',
      templateUrl: 'app/supplier/detail.html',
      controller: 'SupplierDetailCtrl',
      resolve: {
        supplier: function($stateParams, $http) {
          return $http.get('/api/supplier/' + $stateParams.id);
        }
      }
    })

    // products
    .state('products', {
      url: '/products',
      templateUrl: 'app/products/products.html',
      controller: 'ProductsCtrl',
      reloadOnSearch: false
    })
    .state('productsCompare', {
      url: '/products/compare/?',
      templateUrl: 'app/products/compare.html',
      controller: 'ProductsCompareCtrl'
    })
    .state('productRating', {
      url: '/products/:id/ratings',
      templateUrl: 'app/rating/rating.html',
      controller: 'ProductRatingCtrl'
    })
    .state('productDetail', {
      url: '/products/:id',
      templateUrl: 'app/products/detail.html',
      controller: 'ProductDetailCtrl',
      resolve: {
        product: function($stateParams, $http) {
          return $http.get('/api/product/' + $stateParams.id);
        }
      }
    })
    .state('productSplit', {
      url: '/products/split/:slug/:rev1/:rev2',
      controller: 'ProductSplitCtrl',
      templateUrl: 'app/products/split.html'
    })
    .state('productRevisionDetail', {
      url: '/products/:id/:revisionId',
      templateUrl: 'app/products/detail.html',
      controller: 'ProductDetailCtrl',
      resolve: {
        product: function($stateParams, $http) {
          return $http.get('/api/product/' + $stateParams.id + '/' + $stateParams.revisionId);
        }
      }
    })

    // Account
    .state('login', {
      url: '/login',
      templateUrl: 'app/account/login/login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/account/signup/signup.html',
      controller: 'SignupCtrl'
    })
    .state('settings', {
      url: '/account/change-password',
      templateUrl: 'app/account/settings/settings.html',
      controller: 'SettingsCtrl',
      authenticate: true
    })
    .state('edit', {
      url: '/account/edit',
      templateUrl: 'app/account/edit/edit.html',
      controller: 'EditCtrl',
      authenticate: true
    })
    .state('activate', {
      url: '/account/activate/:id',
      templateUrl: 'app/account/activate/activate.html',
      controller: 'ActivateCtrl'
    })

    // Admin
    .state('users', {
      url: '/admin/users',
      templateUrl: 'app/admin/users/users.html',
      controller: 'AdminUsersCtrl',
      authenticate: true
    })
    .state('pages', {
      url: '/admin/pages',
      templateUrl: 'app/admin/page/page.html',
      controller: 'AdminPageCtrl',
      authenticate: true
    })
    .state('admin-suppliers', {
      url: '/admin/suppliers',
      templateUrl: 'app/admin/suppliers/suppliers.html',
      controller: 'AdminSupplierCtrl',
      authenticate: true
    })
    .state('admin-products', {
      url: '/admin/products',
      templateUrl: 'app/admin/products/products.html',
      controller: 'AdminProductsCtrl',
        authenticate: true
    })
    .state('admin-ratings', {
      url: '/admin/ratings',
      templateUrl: 'app/admin/ratings/ratings.html',
      controller: 'AdminRatingsCtrl',
      authenticate: true
    })
    .state('admin-glossary', {
      url: '/admin/glossary',
      templateUrl: 'app/admin/glossary/glossary.html',
      controller: 'AdminGlossaryCtrl',
      authenticate: true
    })
    .state('upload', {
      url: '/admin/upload',
      templateUrl: 'app/admin/upload/upload.html',
      controller: 'AdminUploadCtrl',
      authenticate: true
    })

    // Glossary
    .state('glossary', {
      url: '/glossary',
      templateUrl: 'app/glossary/glossary.html',
      controller: 'GlossaryCtrl'
    })

    // Pages
    .state('otherwise', {
        url: '*path',
        templateUrl: 'app/page/page.html',
        controller: 'PageCtrl'
    });
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, growl) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.config.url === '/api/users/me') {
          return $q.reject(response); // do not redirect to login for status check
        }
        if(response.status === 401) {
          growl.error('You are currently logged out. Please <a href="/login" target="_self">login</a>.', {ttl: -1});
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .factory('PageTitle', function($rootScope) {
    return function (title) {
      $rootScope.title = 'SpeechBubble - ' + title;
    };
  })

  .run(function ($rootScope, $location, Auth, $window) {
    $window.disqus_config = function () {
        this.page.remote_auth_s3 = Auth.getCurrentUser().disqus.auth;
        this.page.api_key = Auth.getCurrentUser().disqus.pubKey;
    }
    
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        $window.doorbellOptions.email = Auth.getCurrentUser().email;        
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
