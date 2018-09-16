# SoftEtherAdmin: A Web UI for SoftEther VPN Server
SoftEtherAdmin is a web based UI for the SoftEther VPN server. Currently it only supports read operations, and the feature set is not complete!
The UI design is the [Light Bootstarp Dashboard theme](https://github.com/creativetimofficial/light-bootstrap-dashboard) by the lovely folks at [Creative Tim](https://www.creative-tim.com/).


# Install
## Prerequisites
 * SoftEther (https://www.softether.org/)
 * node.js v8+ (https://nodejs.org/en/)
 * [optional] pm2 (http://pm2.keymetrics.io/)
 * [optional] a web server (ex.: nginx)

## Files
First, you need to clone/download the files:

### Cloning
Note: git should be installed on your system!
```shell
cd /srv
sudo git clone https://github.com/notisrac/SoftEtherAdmin.git
```

### Restoring npm packages
```shell
cd /srv/SoftEtherAdmin
sudo npm install
```

### Downloading
Note: unzip should be installed on your system!
```shell
wget -O SoftEtherAdmin.zip https://github.com/notisrac/SoftEtherAdmin/archive/master.zip
sudo unzip SoftEtherAdmin.zip -d /srv/SoftEtherAdmin
```

### Web server
For serving the app through a web server, all you need to do is, configure the web server as a reverse proxy pointing to the application's port.
*nginx example*:
```
server {
        listen 80;
        listen [::]:80;
        server_name SoftEtherAdmin;

        location / {
                proxy_pass http://localhost:8000; # <- this is where out app is listening
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}

```

## Config
The configuration of the app is handled by the `config` node module (https://www.npmjs.com/package/config).
By default you need to modify the `config/default.json` file:
```json
{
    "serverPort": 8000,
    "softEther" : {
        "address" : "localhost",
        "port" : 5555,
        "vpncmdPath" : "/usr/local/vpnserver/vpncmd",
        "password" : "supersecretpassword1"
    }
}
```
Where:
 - **serverPort**: The port, where the node.js server should be listening
 - **address**: Address of the VPN server. If you want to host this app on the same server as the VPN server, use `localhost`
 - **port**: The port of the VPN server
 - **vpncmdPath**: Absolute path to the vpncmd application. (On Windows, use double backslashes: `c:\\...\\...`!)
 - **password**: Server admin level password

_Note: if you have cloned the repo, it is advisable to have the config in a `config/local.json` file. This way, when pulling new versions of the repo, your config is not overwritten!_

More config file related info can be found here: https://github.com/lorenwest/node-config/wiki/Configuration-Files

## pm2
pm2 is a process manager for node.js. It can monitor your app, launch it on server start, etc.

Install:
```shell
npm install pm2 -g
```
Register the app with pm2
```shell
cd /srv/SoftEtherAdmin
pm2 start app.js --name "softetheradmin" 
```
Check the current status of the app
```shell
pm2 show softetheradmin
```
List all apps manged by pm2
```shell
pm2 list
```
You can also stop `pm2 stop softetheradmin` and restart `pm2 restart softetheradmin` the app.

# Troubleshooting
## Run the app from the console
```shell
cd /srv/softetheradmin
node app.js
```
This should result in a `Server listening on port: <PORT>` message, where `<PORT>` is the value of the `serverPort` config setting.
If there were error while starting the app or running it, it will be printed out here.

## How the app is accessing VPN server data
It uses the `vpncmd` application, that is distributed with the SoftEther VPN Server installer. Here are two examples:

This one is run on a linux box, and retrieves the list of hubs:
```shell
/usr/local/vpnserver/vpncmd <SERVER>:<PORT> /SERVER /PASSWORD:<PASSWORD> /CSV /CMD HubList
```

This one is run on a windows machine, and executes all the commands in the `scripts/vpncmd_hubinfofull.txt` file on the selected hub:
```shell
"c:\Program Files\SoftEther VPN Client Manager\vpncmd_x64.exe" <SERVER>:<PORT> /SERVER /PASSWORD:<PASSWORD> /CSV /ADMINHUB:<HUBNAME> /IN:"scripts/vpncmd_hubinfofull.txt"
```

## pm2 monitoring
```shell
pm2 monit
```

# TODO
 - [ ] Add logging (use [winston](https://www.npmjs.com/package/winston))
 - [ ] Display more information about the server and the hubs (ex.: ports, openVPN status, etc.)
 - [ ] Make server logs downloadable
 - [ ] Add functionality to modify settings of the server
 - [ ] Extract the softEther.js file into a standalone module once it is done
 - [ ] User management??? (not quite sure, this is needed)

# How to contribute
Pull requests are always welcome! :)

[![Analytics](https://ga-beacon.appspot.com/UA-122950438-1/SoftEtherAdmin)](https://github.com/igrigorik/ga-beacon)
