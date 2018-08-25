var express = require('express');
var router = express.Router();
var cache = require('../modules/cache');

router.get('/', function (req, res) {
    res.send('hub');
});

module.exports = router;