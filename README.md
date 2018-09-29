# SoftEtherAdmin: A Web UI for SoftEther VPN Server
SoftEtherAdmin is a web based UI for the SoftEther VPN server. Currently it only supports read operations, and the feature set is not complete!
The UI design is the [Light Bootstarp Dashboard theme](https://github.com/creativetimofficial/light-bootstrap-dashboard) by the lovely folks at [Creative Tim](https://www.creative-tim.com/).


# Install
## Prerequisites
 * SoftEther vpncmd (https://www.softether.org/)
 * node.js v8+ (https://nodejs.org/en/)
 * [optional] pm2 (http://pm2.keymetrics.io/)
 * [optional] a web server (ex.: nginx)


## Linux
### Getting the files
First, you need to clone/download the files:
```shell
# GIT clone (Note: git should be installed on your system!)
cd /srv
sudo git clone https://github.com/notisrac/SoftEtherAdmin.git

## OR ##

# Download (Note: unzip should be installed on your system!)
wget -O SoftEtherAdmin.zip https://github.com/notisrac/SoftEtherAdmin/archive/master.zip
sudo unzip SoftEtherAdmin.zip -d /srv/SoftEtherAdmin
```

### Restore npm packages
Before running the application, you must restore the npm packages!
```shell
cd /srv/SoftEtherAdmin
sudo npm install
```

### Configure the application
Follow the instructions in the [config section](#config) to set up the application.
You should have a config something like this:
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

### Test
At this stage the application should be runnable:
```shell
node app.js
```
Open another shell, and:
```shell
wget http://localhost:8000/
```


### Managing
The recommended way of managing node.js apps is to use `pm2`:
```shell
# first, you need to install pm2 globally
npm install pm2 -g
# enter the dir wher SoftEtherAdmin is installed
cd /srv/SoftEtherAdmin
# Register the app with pm2
pm2 start app.js --name "softetheradmin" 
```

More info in the [pm2 section](#pm2)


### Web server
For serving the app through a web server, all you need to do is, configure the web server as a reverse proxy pointing to the application's port.
**nginx example**:
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


## Windows
Download the file https://github.com/notisrac/SoftEtherAdmin/archive/master.zip
Then extract it to a folder. We will be using:
```
C:\NodeApps\
```

### Restore npm packages
```shell
cd C:\NodeApps\SoftEtherAdmin
npm install
```

### Configure the application
Follow the instructions in the [config section](#config) to set up the application.
You should have a config something like this:
```json
{
    "serverPort": 8000,
    "softEther" : {
        "address" : "localhost",
        "port" : 5555,
        "vpncmdPath" : "C:\\Program Files\\SoftEther\\vpncmd.exe",
        "password" : "supersecretpassword1"
    }
}
```

### Test
At this stage the application should be runnable:
```shell
node app.js
```
Open a browser, and navigate to: `http://localhost:8000/`

### Managing
The recommended way of managing node.js apps is to use `pm2`:

```shell
# first, you need to install pm2 globally
npm install pm2 -g
```

Before you can use pm2 on windows, there are a few things that needs to be done:

**pm2 folder**
 - Create a folder for pm2: `C:\NodeApps\_pm2`

**PM2_HOME environment variable**
 - Create a new system level environment variable `PM2_HOME`, with the value `C:\NodeApps\_pm2`
 - (You are better off restarting windows, for changes to take effect)
 - Ensure that the variable is set up correctly `echo %PM2_HOME%`

**Register the app in pm2**
```shell
# enter the dir wher SoftEtherAdmin is installed
cd /srv/SoftEtherAdmin
# Register the app with pm2
pm2 start app.js --name "softetheradmin" 
# If everything went fine, save the config
pm2 save
```

**Create a service out of pm2**

We will do this with the help of [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service)
```shell
## Make sure, you do this in an ADMINISTRATOR cmd ##
# install
npm install -g pm2-windows-service
# Create the service
pm2-service-install -n PM2
```
Answer the setup questions like this:
 - ? Perform environment setup (recommended)? **Yes**
 - ? Set PM2_HOME? **Yes**
 - ? PM2_HOME value (this path should be accessible to the service user and
should not contain any "user-context" variables [e.g. %APPDATA%]): **C:\NodeApps\_pm2**
 - ? Set PM2_SERVICE_SCRIPTS (the list of start-up scripts for pm2)? **No**
 - ? Set PM2_SERVICE_PM2_DIR (the location of the global pm2 to use with the service)? [recommended] **Yes**
 - ? Specify the directory containing the pm2 version to be used by the
service C:\USERS\NOTI\APPDATA\ROAMING\NPM\node_modules\pm2\index.js **press enter**
 - PM2 service installed and started.


Big thanks to Walter Accantelli for the Windows instructions: 
https://blog.cloudboost.io/nodejs-pm2-startup-on-windows-db0906328d75

More info in the [pm2 section](#pm2)


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
 - **serverPort**: The port, where the node.js server should be listening. _Note: if you install multiple instances of the app, each needs a different port!_
 - **address**: Address of the VPN server. If you want to host this app on the same server as the VPN server, use `localhost`
 - **port**: The port of the VPN server
 - **vpncmdPath**: Absolute path to the vpncmd application. (On Windows, use double backslashes: `c:\\...\\...`!)
 - **password**: Server admin level password

_Note: if you have cloned the repo, it is advisable to have the config in a `config/local.json` file. This way, when pulling new versions of the repo, your config is not overwritten!_

More config file related info can be found here: https://github.com/lorenwest/node-config/wiki/Configuration-Files

## pm2
pm2 is a process manager for node.js. It can monitor your app, launch it on server startup, etc.

Install:
```shell
npm install pm2 -g
```
Register the app with pm2
```shell
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
 - [ ] The second (third, etc.) api calls for the same resource should wait for the first one to finish
 - [ ] Display more information about the server and the hubs (ex.: ports, openVPN status, etc.)
 - [ ] Make server logs downloadable
 - [ ] Add functionality to modify settings of the server
 - [ ] Extract the softEther.js file into a standalone module once it is done
 - [ ] Make it a bit more colorful by adding SoftEther's icons (?)
 - [ ] User management??? (not quite sure, this is needed)

# How to contribute
Pull requests are always welcome! :)

# Screenshots
![Dashboard][dashboard_png]
![Server][server_png]
![Hub list][hublist_png]
![Hub details 1][hub_details_1_png]
![Hub details 2][hub_details_2_png]
![Config][config_png]

[![Analytics](https://ga-beacon.appspot.com/UA-122950438-1/SoftEtherAdmin)](https://github.com/igrigorik/ga-beacon)


[config_png]: docs/config.png "Config"
[dashboard_png]: docs/dashboard.png "Dashboard"
[hub_details_1_png]: docs/hub_details_1.png "Hub details 1"
[hub_details_2_png]: docs/hub_details_2.png "Hub details 2"
[hublist_png]: docs/hublist.png "Hub list"
[server_png]: docs/server.png "Server"
