'use strict';

var softEtherAdminApp = angular.module('softEtherAdminApp', [
    'ngRoute',
    'dashboardModule',
    'serverModule'
]);

softEtherAdminApp.controller('HeaderController', function ($scope, $http) {
    var self = this;
    self.hostName = '-unknown-';
    
    $http.get('api/server/info').then(function(response) {
        var data = response.data;
        self.hostName = data['Host Name'];
        self.version = data['Version'];
    });
});

softEtherAdminApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }
]);
