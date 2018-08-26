'use strict';

angular.module('dashboardModule', [
    'ngRoute'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'js/app/dashboard/dashboard.template.html',
      controller: 'dashboard'
    });
  }])
  
.controller('dashboard', [function() {
  // TODO fill me
}]);
