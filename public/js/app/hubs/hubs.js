'use strict';

var module = angular.module('hubsModule', ['ngRoute']);

module.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
    .when('/hubs', {
      templateUrl: 'js/app/hubs/hubs.template.html',
      controller: 'hubsController'
    })
    .when('/hubs/:hubName', {
      templateUrl: 'js/app/hubs/hubs.template.html',
      controller: 'hubsController'
    });
  }
]);

module.controller('hubsController', function ($scope, $http, $location, $routeParams) {
  var self = this;
  self.hubName = $routeParams.hubName;

  self.showDetails = function (hubName) {
    $location.path('hubs/' + hubName);
    //self.hubName = hubName;
    //console.log('Selected hub: ' + hubName);
  };
});

module.component('hubList', {
  templateUrl: 'js/app/hubs/hubs.hublist.template.html',
  bindings: {
    callback: '<'
  },
  controller: function ($http) {
    var ctrl = this;
    ctrl.loading = true;
    ctrl.errorMessage = null;

    $http
      .get('api/server/hublist')
      .then(
        function (response) {
          ctrl.data = response.data;
          // convert all the Transfer Bytes to the largest unit
          for (let i = 0; i < ctrl.data.length; i++) {
            ctrl.data[i]['transferredData'] = convertToLargestDataUnit(ctrl.data[i]['Transfer Bytes']);
          }
        },
        function (reason) {
          console.log(reason);
          ctrl.errorMessage = reason.statusText;
        }
      )
      .finally(function () {
        ctrl.loading = false;
      });
  }
});

module.component('hubDetails', {
  templateUrl: 'js/app/hubs/hubs.hubdetails.template.html',
  bindings: {
    $router: '<',
    hubName: '<'
  },
  controller: function ($http) {
    var ctrl = this;

    // handle incoming hubname
    ctrl.$onChanges = function (changes) {
      if (!ctrl.hubName) {
        // console.log('hubName is not defined!');
        return;
      }

      ctrl.loading = true;
      ctrl.errorMessage = null;
      ctrl.loading_session = true;
      ctrl.errorMessage_session = null;
      ctrl.hasData = false;

      $http
        .get('api/hub/' + ctrl.hubName + '/hubData')
        .then(
          function (response) {
            ctrl.statusData = response.data['StatusGet'];
            ctrl.accessListData = response.data['AccessList'];
            ctrl.accessListHeaders = getArrayHeaders(ctrl.accessListData);

            ctrl.userListData = response.data['UserList'];
            ctrl.userListHeaders = getArrayHeaders(ctrl.userListData);

            ctrl.groupListData = response.data['GroupList'];
            ctrl.groupListHeaders = getArrayHeaders(ctrl.groupListData);

            ctrl.macTableData = response.data['MacTable'];
            ctrl.ipTableData = response.data['IpTable'];

            ctrl.sessionListData = response.data['SessionList'];
            // merge the ip and the mac address into the session list
            mergeSessionData(ctrl);
            ctrl.sessionListHeaders = getArrayHeaders(ctrl.sessionListData);

            ctrl.hasData = true;
          },
          function (reason) {
            console.log(reason);
            ctrl.errorMessage = ctrl.errorMessage_session = reason.statusText;
          }
        )
        .finally(function () {
          ctrl.loading = false;
          ctrl.loading_session = false;
        });

    }; // onchange

    ctrl.reloadSessionList = function () {
      ctrl.loading_session = true;
      $http
        .get('api/hub/' + ctrl.hubName + '/sessionData')
        .then(
          function (response) {
            ctrl.macTableData = response.data['MacTable'];
            ctrl.ipTableData = response.data['IpTable'];
            ctrl.sessionListData = response.data['SessionList'];
            // merge the ip and the mac address into the session list
            mergeSessionData(ctrl);
            ctrl.sessionListHeaders = getArrayHeaders(ctrl.sessionListData);

            // ctrl.hasData = true;
          },
          function (reason) {
            console.log(reason);
            ctrl.errorMessage_session = reason.statusText;
          }
        )
        .finally(function () {
          ctrl.loading_session = false;
        });
    }; // reloadSessionList
  } // controller

});

function mergeSessionData(ctrl) {
  // merge the ip and the mac address into the session list
  for (let i = 0; i < ctrl.sessionListData.length; i++) {
    delete ctrl.sessionListData[i]['Transfer Packets'];
    ctrl.sessionListData[i]['Transfer Bytes'] = convertToLargestDataUnit(ctrl.sessionListData[i]['Transfer Bytes']);
    const name = ctrl.sessionListData[i]['Session Name'];
    // merge the mac
    for (let j = 0; j < ctrl.macTableData.length; j++) {
      if (ctrl.macTableData[j]['Session Name'] == name) {
        ctrl.sessionListData[i]['MAC Address'] = ctrl.macTableData[j]['MAC Address'];
      }
    }
    // merge the ip
    for (let j = 0; j < ctrl.ipTableData.length; j++) {
      if (ctrl.ipTableData[j]['Session Name'] == name) {
        const address = ctrl.ipTableData[j]['IP Address'];
        if (address.includes(':')) {
          // ipv6
          ctrl.sessionListData[i]['IPv6 Address'] = address;
        }
        else {
          // ipv4
          ctrl.sessionListData[i]['IPv4 Address'] = address;
        }
      }
    }
  }
}