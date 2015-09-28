'use strict';

/**
 * @ngdoc overview
 * @name peopleUiApp
 * @description
 * # peopleUiApp
 *
 * Main module of the application.
 */
angular
  .module('peopleUiApp', [
    'ngResource',
    'ngRoute',
    'spring-data-rest'
  ])
  .config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        })
        .when('/people', {
          templateUrl: 'views/people.html',
          controller: 'PeopleCtrl',
          controllerAs: 'people'
        })
        .otherwise({
          redirectTo: '/'
        });

    }]);
