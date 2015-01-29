/* jshint ignore:start */

'use strict';

angular.module('joeyismImgurApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angular-loading-bar',
  'ngTouch'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,cfpLoadingBarProvider) {
  $urlRouterProvider.otherwise('/');
    cfpLoadingBarProvider.includeSpinner = false;

  $locationProvider.html5Mode(true);

  $stateProvider.state('main', {
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });

  $stateProvider.state('imgur-lite',{
    url: '/imgurlite',
    template: '<div joeyism-imgur-lite></div>'
  });

    $httpProvider.interceptors.push('authInterceptor');
}).factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      config.headers.Authorization = "Client-ID 31b48b2469457ee";
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
