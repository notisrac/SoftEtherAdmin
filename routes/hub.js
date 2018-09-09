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

router.get('/:hubName/hubData', cache(10), function (req, res) {
    handleResponse(softEther.executeFile('scripts/vpncmd_hubinfofull.txt', getHubName(req), { 
        StatusGet: { csv: true, flatten: true }, 
        AccessList: { csv: true, flatten: false }, 
        UserList: { csv: true, flatten: false }, 
        GroupList: { csv: true, flatten: false }, 
        SessionList: { csv: true, flatten: false }, 
        MacTable: { csv: true, flatten: false }, 
        IpTable: { csv: true, flatten: false }
    }), res);
});

router.get('/:hubName/sessionData', cache(10), function (req, res) {
    handleResponse(softEther.executeFile('scripts/vpncmd_hubsessioninfo.txt', getHubName(req), { 
        SessionList: { csv: true, flatten: false }, 
        MacTable: { csv: true, flatten: false }, 
        IpTable: { csv: true, flatten: false }
    }), res);
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