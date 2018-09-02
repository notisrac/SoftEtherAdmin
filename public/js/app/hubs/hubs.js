'use strict';

var module = angular.module('hubsModule', [
  'ngRoute'
]);

module.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/hubs', {
    templateUrl: 'js/app/hubs/hubs.template.html',
    controller: 'hubsController'
  });
}]);

module.controller('hubsController', function ($scope, $http) {
  var self = this;
});

module.component('hubList', {
  templateUrl: 'js/app/hubs/hubs.hublist.template.html',
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
