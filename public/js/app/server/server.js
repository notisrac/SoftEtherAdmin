'use strict';

var module = angular.module('serverModule', [
  'ngRoute'
]);

module.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/server', {
    templateUrl: 'js/app/server/server.template.html',
    controller: 'ServerController'
  });
}])

module.controller('ServerController', function ($scope, $http) {
});

module.component('hubList', {
  templateUrl: 'js/app/server/server.hublist.template.html',
  bindings: {},
  controller: function ($http) {
    var ctrl = this;
    ctrl.loading = true;
    ctrl.errorMessage = null;

    $http.get('api/server/hublist').then(function (response) {
      ctrl.data = response.data;
    }, function (reason) {
      console.log(reason);
      ctrl.errorMessage = reason.statusText;
    }).finally(function () {
      ctrl.loading = false;
    });
  }
});

module.component('connectionsList', {
  templateUrl: 'js/app/server/server.connections.template.html',
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
