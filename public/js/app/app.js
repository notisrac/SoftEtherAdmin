'use strict';

var softEtherAdminApp = angular.module('softEtherAdminApp', [
    'ngRoute',
    'dashboardModule',
    'serverModule'
]);

softEtherAdminApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }
]);

softEtherAdminApp.controller('HeaderController', function ($scope, $http) {
    $scope.loading = true;
    
    $http.get('api/server/info').then(function(response) {
        var data = response.data;
        $scope.hostName = data['Host Name'];
        $scope.version = data['Version'];
    }, function (reason) {
        console.log(reason);        
        $scope.hostName = '-unknown-';
    }).finally(function () {
        $scope.loading = false;
    });
});

softEtherAdminApp.controller('SidebarController', function ($scope, $location) {
    $scope.navData = [
        {
            isActive: false,
            path: 'dashboard',
            icon: 'pe-7s-graph',
            text: 'Dashboard'
        },
        {
            isActive: false,
            path: 'server',
            icon: 'pe-7s-server',
            text: 'Server'
        },
        {
            isActive: false,
            path: 'hubs',
            icon: 'pe-7s-share',
            text: 'Hubs'
        },
        {
            isActive: false,
            path: 'config',
            icon: 'pe-7s-config',
            text: 'Config'
        }
    ];

    $scope.$on('$locationChangeSuccess', function(event) {
        var path = $location.path();
        for (let i = 0; i < $scope.navData.length; i++) {
            if (path.startsWith('/' + $scope.navData[i].path)) {
                $scope.navData[i].isActive = true;
            }
            else {
                $scope.navData[i].isActive = false;
            }
        }
    });
});

softEtherAdminApp.component('loadingIndicator', {
    templateUrl: 'loadingIndicator.html',
    bindings: {
        errorMessage: '<',
        loading: '<'
    },
    controller: function () {
        // var ctrl = this;
        // console.log(ctrl.loading + ' - ' + ctrl.errorMessage);        
    }
});
