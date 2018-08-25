var express = require('express');
var app = express();
var bodyParser = require('body-parser');
global.config = require('config');
var path = require('path');

var api_server = require('./routes/server');
var api_hub = require('./routes/hub');

// set up the static files
app.use(express.static(path.join(__dirname, '/public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use('/api/server', api_server);
app.use('/api/hub', api_hub);


// start the server
var serverPort = global.config.get('serverPort');
app.listen(serverPort);
console.log('Server listening on port: ' + serverPort);


/// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// TODO add caching of vpncmd calls https://www.npmjs.com/package/memory-cache
// TODO add logging (ex.: winston) https://www.npmjs.com/package/winston
// DONE find a ui design: https://github.com/creativetimofficial/light-bootstrap-dashboard