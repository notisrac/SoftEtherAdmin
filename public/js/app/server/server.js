'use strict';

angular.module('serverModule', [
    'ngRoute'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/server', {
      templateUrl: 'js/app/server/server.template.html',
      controller: 'server'
    });
  }])
  
.controller('server', [function() {
  // TODO fill me
}]);
