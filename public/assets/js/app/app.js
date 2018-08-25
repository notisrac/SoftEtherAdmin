var softEtherAdmin = angular.module('softEtherAdmin', []);

softEtherAdmin.controller('HeaderController', function ($scope) {
    var self = this;
    self.serverName = '-unknown-';

    $.get( "api/server/about", function( data ) {
        $( ".result" ).html( data );
        alert( "Load was performed." );
        self.serverName = '-unknown-';
    });
});