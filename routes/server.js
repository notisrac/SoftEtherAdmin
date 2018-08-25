var express = require('express');
var router = express.Router();
var softEther = require('../modules/softEther');
var cache = require('../modules/cache');

router.get('/status', cache(10), function (req, res) {
    handleResponse(softEther.serverStatusGet(), res);
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