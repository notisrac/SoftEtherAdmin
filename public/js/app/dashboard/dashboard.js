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

module.controller('dashboardController', function ($scope, $http) {
  var self = this;
  self.loading = true;
  self.errorMessage = null;

  // get the server status
  $http.get('api/server/dashboardData').then(function (response) {
    var serverStatusData = response.data['ServerStatusGet'];
    self.infoData = response.data['ServerInfoGet'];

    // calculate the uptime
    var startDateString = serverStatusData['Server Started at'].replace(/\(\w*\)./g, '');
    self.uptime = getUptime(startDateString);

    // calculate the unicast data transferred
    var unicastOutData = serverStatusData['Outgoing Unicast Total Size'];
    var unicastInData = serverStatusData['Incoming Unicast Total Size'];
    self.unicastData = convertToLargestDataUnit(unicastInData) + '/' + convertToLargestDataUnit(unicastOutData);

    // calculate the broadcast data transferred
    var broadcastOutData = serverStatusData['Outgoing Broadcast Total Size'];
    var broadcastInData = serverStatusData['Incoming Broadcast Total Size'];
    self.broadcastData = convertToLargestDataUnit(broadcastInData) + '/' + convertToLargestDataUnit(broadcastOutData);

    self.numberOfUsers = serverStatusData['Number of Users'];
    self.numberOfSessions = serverStatusData['Number of Sessions'];

    var keysToKeep = [
      'Server Type',
      'Number of Active Sockets',
      'Number of MAC Address Tables',
      'Number of IP Address Tables',
      'Number of Groups',
      'Using Client Connection Licenses (This Server)',
      'Using Bridge Connection Licenses (This Server)',
      'Server Started at',
      'Current Time'
    ];

    // filter the data, as we don't need everything
    for (var key in serverStatusData) {
      if (serverStatusData.hasOwnProperty(key)) {
        if (!keysToKeep.includes(key)) {
          delete serverStatusData[key];
        }
      }
    }
    self.statusData = serverStatusData;

  }, function (reason) {
    console.log(reason);
    self.errorMessage = reason.statusText;
  }).finally(function () {
    self.loading = false;
  });

});