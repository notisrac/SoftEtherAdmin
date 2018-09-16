var express = require('express');
var router = express.Router();
var softEther = require('../modules/softEther');
var cache = require('../modules/cache');
var cors = require('cors');

router.use(cors());

router.get('/status', cache(10), function (req, res) {
    handleResponse(softEther.serverStatusGet(), res);
});

router.get('/info', cache(10), function (req, res) {
    handleResponse(softEther.serverInfoGet(), res);
});

router.get('/about', cache(10), function (req, res) {
    handleResponse(softEther.about(), res);
});

router.get('/check', cache(10), function (req, res) {
    handleResponse(softEther.check(), res);
});

router.get('/hubList', cache(10), function (req, res) {
    handleResponse(softEther.hubList(), res);
});

router.get('/caps', cache(10), function (req, res) {
    handleResponse(softEther.caps(), res);
});

router.get('/connectionList', cache(10), function (req, res) {
    handleResponse(softEther.connectionList(), res);
});

router.get('/config', cache(10), function (req, res) {
    handleResponse(softEther.configGet(), res);
});

router.get('/dashboardData', cache(10), function (req, res) {
    handleResponse(softEther.executeFile('scripts/vpncmd_serverinfo.txt', null, { ServerInfoGet: { csv: true, flatten: true }, ServerStatusGet: { csv: true, flatten: true } }), res);
});

// throw a not found for unknown commands
router.use('/*', function(req, res, next) {
    res.sendStatus(404);
});

function handleResponse(promise, res) {
    promise
    .then(function (data) {
        sendResult(res, data);
    })
    .catch(function (err) {
        handleError(res, err);
    });
}

function sendResult(res, data) {
    console.log(data);
    res.status(200).send(data);
}

function handleError(res, err) {
    console.log(err);    
    res.status(500);
}

module.exports = router;