var express = require('express');
var app = express();
var bodyParser = require('body-parser');
global.config = require('config');
var path = require('path');
var cors = require('cors');

var route_api_server = require('./routes/server');
var route_api_hub = require('./routes/hub');
var route_ui = require('./routes/ui');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use('/api/server', route_api_server);
app.use('/api/hub', route_api_hub);
//app.use('/', route_ui);
// set up the static files
app.use(express.static(path.join(__dirname, '/public')));


// start the server
var serverPort = global.config.get('serverPort');
app.listen(serverPort);
console.log('Server listening on port: ' + serverPort);


/// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// DONE add caching of vpncmd calls https://www.npmjs.com/package/memory-cache
// TODO add logging (ex.: winston) https://www.npmjs.com/package/winston
// DONE find a ui design: https://github.com/creativetimofficial/light-bootstrap-dashboard