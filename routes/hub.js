var express = require('express');
var router = express.Router();
var cache = require('../modules/cache');
var cors = require('cors');
var softEther = require('../modules/softEther');

router.use(cors());

router.get('/:hubName/status', cache(10), function (req, res) {
    handleResponse(softEther.hubStatus(getHubName(req)), res);
});
router.get('/:hubName/userList', cache(10), function (req, res) {
    handleResponse(softEther.hubUserList(getHubName(req)), res);
});

function getHubName(req) {
    return req.params['hubName'];
}

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