var express = require('express');
var router = express.Router();
var cache = require('../modules/cache');
var cors = require('cors');

router.use(cors());

router.get('/', function (req, res) {
    res.send('hub');
});

module.exports = router;