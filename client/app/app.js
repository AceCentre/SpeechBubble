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
  //'frapontillo.bootstrap-switch'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, growlProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    growlProvider.globalTimeToLive({success: 2000, error: 5000, warning: 2000, info: 2000});
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
