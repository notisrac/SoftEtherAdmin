'use strict';

angular.module('configModule', [
    'ngRoute'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/config', {
      templateUrl: 'js/app/config/config.template.html',
      controller: 'configController'
    });
  }])
  
.controller('configController', function($scope, $http) {
  $scope.loading = true;
  $scope.errorMessage = null;

  $http.get('api/server/config').then(function (response) {
    $scope.serverConfig = response.data;
  }, function (reason) {
    console.log('error');
    console.log(reason.statusText);
    $scope.errorMessage = reason.statusText;
  }).finally(function () {
    $scope.loading = false;
  });
});
