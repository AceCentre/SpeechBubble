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
  'ui.select'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, growlProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    growlProvider.globalTimeToLive({success: 2000, error: 5000, warning: 2000, info: 2000});

    /**
     * Routes
     */
    $stateProvider

    // Main
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
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

    // products
    .state('products', {
      url: '/products',
      templateUrl: 'app/products/products.html',
      controller: 'ProductsCtrl'
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
      controller: 'AdminProductsCtrl'
    })
    .state('upload', {
      url: '/admin/upload',
      templateUrl: 'app/admin/upload/upload.html',
      controller: 'AdminUploadCtrl',
      authenticate: true
    })

    // Pages
    .state('otherwise', {
        url: '*path',
        templateUrl: 'app/page/page.html',
        controller: 'PageCtrl'
    });
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
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
        if(response.status === 401) {
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

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
