'use strict';

var module = angular.module('dashboardModule', [
  'ngRoute'
]);

module.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'js/app/dashboard/dashboard.template.html',
    controller: 'dashboardController'
  });
}]);

module.controller('dashboardController', [function () {
  // TODO fill me
}]);
