'use strict';

angular.module('joeyismImgurApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angular-loading-bar'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $urlRouterProvider
  .otherwise('/');

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');

})
.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      config.headers.Authorization = "Client-ID 33a2cffe7a9c413";
      //console.log(config);
      //console.log($window);
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})
.run(['$rootScope', '$injector', function($rootScope,$injector) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
        if ($rootScope.oauth) headersGetter()['Authorization'] = "Bearer "+$rootScope.oauth.access_token;
        if (data) {
            return angular.toJson(data);
        }
    };
}]);
