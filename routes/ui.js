var express = require('express');
var router = express.Router();
// var cache = require('../modules/cache');
var path = require('path');

var indexPage = path.resolve('public/index.html');

router.get('*', function (req, res) {
    res.sendFile(indexPage);
});

module.exports = router;