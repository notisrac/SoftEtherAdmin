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
  self.loading_status = true;
  self.errorMessage_status = null;
  self.loading_info = true;
  self.errorMessage_info = null;
  self.loading_caps = true;
  self.errorMessage_caps = null;

  // get the server status
  $http.get('api/server/status').then(function (response) {
    var data = response.data;

    // calculate the uptime
    var startDateString = data['Server Started at'].replace(/\(\w*\)./g, '');
    $scope.uptime = getUptime(startDateString);

    // calculate the unicast data transferred
    var unicastOutData = data['Outgoing Unicast Total Size'].replace(/\D/g, ''); // bytes
    var unicastInData = data['Incoming Unicast Total Size'].replace(/\D/g, ''); // bytes
    $scope.unicastData = convertToLargestUnit(unicastInData) + '/' + convertToLargestUnit(unicastOutData);

    // calculate the broadcast data transferred
    var broadcastOutData = data['Outgoing Broadcast Total Size'].replace(/\D/g, ''); // bytes
    var broadcastInData = data['Incoming Broadcast Total Size'].replace(/\D/g, ''); // bytes
    $scope.broadcastData = convertToLargestUnit(broadcastInData) + '/' + convertToLargestUnit(broadcastOutData);

    $scope.numberOfUsers = data['Number of Users'];
    $scope.numberOfSessions = data['Number of Sessions'];

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
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (!keysToKeep.includes(key)) {
          delete data[key];
        }
      }
    }
    $scope.statusData = data;

  }, function (reason) {
    console.log(reason);
    self.errorMessage_status = reason.statusText;
  }).finally(function () {
    self.loading_status = false;
  });


  // get the server info
  $http.get('api/server/info').then(function (response) {
    var data = response.data;
    $scope.infoData = data;

  }, function (reason) {
    console.log(reason);
    self.errorMessage_info = reason.statusText;
  }).finally(function () {
    self.loading_info = false;
  });


  // get the server capabilities
  $http.get('api/server/caps').then(function (response) {
    var data = response.data;
    $scope.capsData = data;

  }, function (reason) {
    console.log(reason);
    self.errorMessage_caps = reason.statusText;
  }).finally(function () {
    self.loading_caps = false;
  });

  // console.log(self);
});

function getUptime(startDateString) {
  // parse the date
  var startDate = Date.parse(startDateString);
  // get the difference
  var dateDifference = Date.now() - startDate;
  // get the total ms, s, m, h, d
  var dateData = getDateTotals(dateDifference);
  // select the largest that is not 0
  if (dateData.d > 0) {
    return dateData.d + 'd';
  }
  else if (dateData.h > 0) {
    return dateData.h + 'h';
  }
  else if (dateData.m > 0) {
    return dateData.m + 'm';
  }
  else {
    return dateData.s + 's';
  }
}

function getDateTotals(date) {
  return {
    ms: Math.floor(date % 1000),
    s: Math.floor(date / 1000 % 60),
    m: Math.floor(date / 60000 % 60),
    h: Math.floor(date / 3600000 % 24),
    d: Math.floor(date / 86400000)
  };
}

function convertToLargestUnit(value) {
  var units = getUnits(value);
  if (units.pb > 0) {
    return units.pb + 'P';
  }
  else if (units.gb > 0) {
    return units.gb + 'G';
  }
  else if (units.mb > 0) {
    return units.mb + 'M';
  }
  else if (units.kb > 0) {
    return units.kb + 'k';
  }
  else {
    return units.b + 'B';
  }
}

function getUnits(value) {
  return {
    b: value,
    kb: Math.floor(value / 1024),
    mb: Math.floor(value / 1048576),
    gb: Math.floor(value / 1073741824),
    pb: Math.floor(value / 1099511627776)
  };
}
