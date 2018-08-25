var exec = require('child-process-promise').exec;
const parse = require('csv-parse');


// https://www.softether.org/4-docs/1-manual/6._Command_Line_Management_Utility_Manual

var softEther = {
    about: function () {
        return this.executeCSVCommand('About');
    },
    serverStatusGet: function () {
        return this.executeCSVCommand('ServerStatusGet');
    },
    listenerList: function () {
        return this.executeCSVCommand('ListenerList');
    },
    clusterSettingGet: function () {
        return this.executeCSVCommand('ClusterSettingGet');
    },
    syslogGet: function () {
        return this.executeCSVCommand('SyslogGet');
    },
    connectionList: function () {
        return this.executeCSVCommand('ConnectionList');
    },
    connectionGet: function (id) {
        return this.executeCSVCommand('ConnectionList', id);
    },
    bridgeDeviceList: function () {
        return this.executeCSVCommand('BridgeDeviceList');
    },
    bridgeList: function () {
        return this.executeCSVCommand('BridgeList');
    },
    caps: function () {
        return this.executeCSVCommand('Caps');
    },
    configGet: function () {
        return this.executeCSVCommand('ConfigGet');
    },
    routerList: function () {
        return this.executeCSVCommand('RouterList');
    },
    routerIfList: function (name) {
        return this.executeCSVCommand('RouterIfList', name);
    },
    routerTableList: function (name) {
        return this.executeCSVCommand('RouterTableList', name);
    },
    logFileList: function () {
        return this.executeCSVCommand('LogFileList');
    },
    hubList: function () {
        return this.executeCSVCommand('HubList');
    },
    hub: function (name) {
        return this.executeCSVCommand('Hub', name);
    },
    check: function () {
        return this.executeCSVCommand('Check');
    },
    etherIpClientList: function () {
        return this.executeCSVCommand('EtherIpClientList');
    },
    openVpnGet: function () {
        return this.executeCSVCommand('OpenVpnGet');
    },
    sstpGet: function () {
        return this.executeCSVCommand('SstpGet');
    },
    vpnOverIcmpDnsGet: function () {
        return this.executeCSVCommand('VpnOverIcmpDnsGet');
    },
    dynamicDnsGetStatus: function () {
        return this.executeCSVCommand('DynamicDnsGetStatus');
    },
    vpnAzureGetStatus: function () {
        return this.executeCSVCommand('VpnAzureGetStatus');
    },


    executeCSVCommand: function (command, commandParams = null, hub = null) {
        var self = this;

        return new Promise(function(resolve, reject) {
            // execute the command, with csv enabled
            self.executeCommand(command, commandParams, hub, true)
            .then(function (result) {
                // try to parse the resulting csv
                parse(result, {columns: true, delimiter: ',', cast: true}, function (err, output) {
                    if (err) {
                        reject(err);
                    }
                    resolve(output);
                });
            })
            .catch(function (err) {
                reject(err);
            });
        });
    },

    // ./vpncmd  localhost:port /SERVER /PASSWORD:asd /HUB:VPN /CSV /CMD hublist
    executeCommand: function (softEtherCommand, softEtherCommandParams, hubName, enableCSV) {
        var command = this.assembleCommand(softEtherCommand, softEtherCommandParams, hubName, enableCSV);
        // TODO removeme
        console.log(command);

        return new Promise(function(resolve, reject) {
            exec(command)
            .then(function (result) {
                var stdout = result.stdout;
                var stderr = result.stderr;
                console.log(stdout);
                console.log(stderr);
                if (stderr || stdout.startsWith('Error occurred.') ) {
                    reject('Error while executing command "' + softEtherCommand + '": \r\n' + stderr + '\r\n' + stdout);
                }

                resolve(stdout);
            })
            .catch(function (err) {
                console.log(err);
                reject('Error while executing command "' + softEtherCommand + '": \r\n' + err);
            });
        });
    },

    assembleCommand: function (softEtherCommand, softEtherCommandParams, hubName, enableCSV) {
        var command = '';
        // vpncmd executeable
        command += '"' + global.config.get('softEther.vpncmdPath') + '"';
        // address:port
        command += ' ' + global.config.get('softEther.address');
        var port = global.config.get('softEther.port');
        if (port) {
            command += ':' + port + '';
        }
        // we want to administer the server
        command += ' /SERVER';
        // password
        var pwd = global.config.get('softEther.password');
        if (pwd) {
            command += ' /PASSWORD:' + pwd;
        }
        // should the return value be in csv
        if (enableCSV) {
            command += ' /CSV';
        }
        // select the hub
        if (hubName) {
            command += ' /HUB:' + hubName;
        }
        // the command to execute on the server
        command += ' /CMD ' + softEtherCommand;
        if (softEtherCommandParams) {
            command += ' ' + softEtherCommandParams;
        }

        return command;
    }
};


module.exports = softEther;