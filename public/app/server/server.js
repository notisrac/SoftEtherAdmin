'use strict';

var module = angular.module('serverModule', [
  'ngRoute'
]);

module.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/server', {
    templateUrl: 'app/server/server.template.html',
    controller: 'ServerController'
  });
}])

module.controller('ServerController', function ($scope, $http) {
  var self = this;
  self.loading_caps = true;
  self.errorMessage_caps = null;

  // get the server capabilities
  $http.get('api/server/caps').then(function (response) {
    var data = response.data;
    self.capsData = data;

  }, function (reason) {
    console.log(reason);
    self.errorMessage_caps = reason.statusText;
  }).finally(function () {
    self.loading_caps = false;
  });
});

module.component('connectionsList', {
  templateUrl: 'app/server/server.connections.template.html',
  bindings: {},
  controller: function ($http) {
    var ctrl = this;
    ctrl.loading = true;
    ctrl.errorMessage = null;

    $http.get('api/server/connectionList').then(function (response) {
      ctrl.data = response.data;
    }, function (reason) {
      console.log(reason);
      ctrl.errorMessage = reason.statusText;
    }).finally(function () {
      ctrl.loading = false;
    });
  }
});
