var exec = require('child-process-promise').exec;
const parse = require('csv-parse');
const parseSync = require('csv-parse/lib/sync');
// the defult options: parse table headers
const csvParseOptions = {
    columns: true,
    delimiter: ',',
    cast: true
};
// key-value pair type: don't parse table headers, start from row 2
const csvParseOptions_flat = {
    columns: null,
    delimiter: ',',
    cast: true,
    from: 2
};
const csvParseOptions_object = {
    columns: true,
    delimiter: ',',
    cast: true,
    objname: 'Item'
};

// https://www.softether.org/4-docs/1-manual/6._Command_Line_Management_Utility_Manual


var softEther = {
    /*
     *   SERVER COMMANDS
     */
    about: function () {
        return this.executeHeaderlessCommand('About');
    },
    serverInfoGet: function () {
        return this.executeCSVCommand('ServerInfoGet', null, null, 0, 0, csvParseOptions_flat, true);
    },
    serverStatusGet: function () {
        return this.executeCSVCommand('ServerStatusGet', null, null, 0, 0, csvParseOptions_flat, true);
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
        return this.executeCSVCommand('Caps', null, null, 0, 0, csvParseOptions_flat, true);
    },
    configGet: function () {
        return this.executeHeaderlessCommand('ConfigGet', null, null, 2, 0);
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
        return this.executeHeaderlessCommand('Check');
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

    /*
     *   HUB COMMANDS
     */
    hubStatus: function (name) {
        return this.executeCSVCommand('StatusGet', null, name, 0, 0, csvParseOptions_flat, true);
    },
    hubUserList: function (name) {
        return this.executeCSVCommand('UserList', null, name);
    },

    /*
     *   COMMON
     */
    executeFile: function (fileName, hub = null, settings = {}) {
        /*
        settings format
         {
            StatusGet : {
                csv: true,
                flatten: true,
                trimStart: 0,
                trimEnd: 0
            }
        }
        */
        var self = this;
        return new Promise(function (resolve, reject) {
            self.executeCommand(null, null, hub, true, fileName, 1, 0)
                .then(function (result) {
                    var retValue = {};
                    var re = new RegExp('.*[\/\w]?>(.*)', 'gm');
                    var matches = [];
                    var m;
                    while (m = re.exec(result)) {
                        matches.push(m);
                    }
                    for (let i = 0; i < matches.length; i++) {
                        // get the actual command
                        const fullCommand = matches[i][0];
                        const command = matches[i][1];
                        // get the settings for this command
                        var cmdSettings = settings[command];
                        // get the data after the command
                        var cmdLocation = matches[i].index + fullCommand.length + 1;
                        var nextCmdLocation = result.length;
                        if (matches[i + 1]) {
                            nextCmdLocation = result.indexOf(matches[i + 1][0]) - 1;
                        }
                        var data = result.substring(cmdLocation, nextCmdLocation);
                        // format the data according to the settings
                        if (cmdSettings) {
                            if (cmdSettings.trimStart) {
                                data = self.trimStart(data, cmdSettings.trimStart);
                            }
                            if (cmdSettings.trimEnd) {
                                data = self.trimEnd(data, cmdSettings.trimEnd);
                            }
                            if (cmdSettings.csv) {
                                var parseOptions = csvParseOptions;
                                if (cmdSettings.flatten) {
                                    parseOptions = csvParseOptions_flat;
                                }
                                data = parseSync(data, parseOptions);
                                if (cmdSettings.flatten) {
                                    data = self.flattenData(data);
                                }
                            }
                        }
                        // add the data to the collection with the command name as the name
                        retValue[command] = data;
                    }
                    resolve(retValue);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    /*
     *   COMMAND FUNCTIONS
     */

    executeHeaderlessCommand: function (command, commandParams = null, hub = null, trimStartLines = 0, trimEndLines = 0) {
        // execute the command, with csv enabled
        return this.executeCommand(command, commandParams, hub, true, null, trimStartLines, trimEndLines);
    },

    executeCSVCommand: function (command, commandParams = null, hub = null, trimStartLines = 0, trimEndLines = 0, parseOptions = csvParseOptions, flatten = false) {
        var self = this;

        return new Promise(function (resolve, reject) {
            // execute the command, with csv enabled
            self.executeCommand(command, commandParams, hub, true, null, trimStartLines, trimEndLines)
                .then(function (result) {
                    // try to parse the resulting csv
                    parse(result, parseOptions, function (err, output) {
                        if (err) {
                            reject(err);
                        }
                        resolve((flatten) ? self.flattenData(output) : output);
                    });
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },

    // ./vpncmd  localhost:port /SERVER /PASSWORD:asd /HUB:VPN /CSV /CMD hublist
    executeCommand: function (softEtherCommand, softEtherCommandParams, hubName, enableCSV, fileName, trimStartLines = 0, trimEndLines = 0) {
        var self = this;
        var command = this.assembleCommand(softEtherCommand, softEtherCommandParams, hubName, enableCSV, fileName);
        // TODO removeme
        //console.log(command);

        return new Promise(function (resolve, reject) {
            exec(command)
                .then(function (result) {
                    var stdout = result.stdout;
                    var stderr = result.stderr;
                    console.log(stdout);
                    console.log(stderr);
                    if (stderr || stdout.startsWith('Error occurred.')) {
                        reject('Error while executing command "' + softEtherCommand + '": \r\n' + stderr + '\r\n' + stdout);
                    }

                    if (trimStartLines > 0) {
                        stdout = self.trimStart(stdout, trimStartLines);
                    }
                    if (trimEndLines > 0) {
                        stdout = self.trimEnd(stdout, trimEndLines);
                    }

                    resolve(stdout);
                })
                .catch(function (err) {
                    console.log(err);
                    reject('Error while executing command "' + softEtherCommand + '": \r\n' + err);
                });
        });
    },

    assembleCommand: function (softEtherCommand, softEtherCommandParams, hubName, enableCSV, fileName) {
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
            //command += ' /HUB:' + hubName; // this would require the hub password, and we only have the server pwd
            command += ' /ADMINHUB:' + hubName;
        }
        // if the filename is specified
        if (fileName) {
            command += ' /IN:"' + fileName + '"';
        }
        else {
            // the command to execute on the server
            command += ' /CMD ' + softEtherCommand;
            if (softEtherCommandParams) {
                command += ' ' + softEtherCommandParams;
            }
        }

        return command;
    },

    /*
     *   HELPER FUNCTIONS
     */

    flattenData: function (data) {
        var retData = {};
        data.forEach(element => {
            // console.log(element);
            retData[element[0]] = element[1];
        });
        return retData;
    },

    trimStart: function (data, count) {
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                data = data.substring(data.indexOf("\n") + 1);
            }
        }
        return data;
    },

    trimEnd: function (data, count) {
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                data = data.substring(data.lastIndexOf("\n") + 1, -1);
            }
        }

        return data;
    }
};


module.exports = softEther;