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
  var self = this;
  self.loading = true;
  self.errorMessage = null;

  $http.get('api/server/config').then(function (response) {
    self.serverConfig = response.data;
  }, function (reason) {
    console.log('error');
    console.log(reason.statusText);
    self.errorMessage = reason.statusText;
  }).finally(function () {
    self.loading = false;
  });
});
