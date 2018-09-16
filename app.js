var express = require('express');
var app = express();
var bodyParser = require('body-parser');
global.config = require('config');
var path = require('path');
var cors = require('cors');

var route_api_server = require('./routes/server');
var route_api_hub = require('./routes/hub');
var route_ui = require('./routes/ui');
var route_static = require('./routes/static');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// set up the static files
app.use(route_static);
// set up the API endpoint
app.use('/api/server', route_api_server);
app.use('/api/hub', route_api_hub);
app.use('/api', function(req, res, next) {
    res.sendStatus(404);
});
// everything else should go to the ui
app.use('/*', route_ui);


// start the server
var serverPort = global.config.get('serverPort');
app.listen(serverPort);
console.log('Server listening on port: ' + serverPort);


// TODO add logging (ex.: winston) https://www.npmjs.com/package/winston
