var express = require('express');
var router = express.Router();
// var cache = require('../modules/cache');
var path = require('path');

router.use('/css', express.static(path.join(__dirname, '../public/css')));
router.use('/css', function(req, res, next) {
    res.sendStatus(404);
});

router.use('/fonts', express.static(path.join(__dirname, '../public/fonts')));
router.use('/fonts', function(req, res, next) {
    res.sendStatus(404);
});

router.use('/img', express.static(path.join(__dirname, '../public/img')));
router.use('/img', function(req, res, next) {
    res.sendStatus(404);
});

router.use('/js', express.static(path.join(__dirname, '../public/js')));
router.use('/js', function(req, res, next) {
    res.sendStatus(404);
});

router.use('/app', express.static(path.join(__dirname, '../public/app')));
router.use('/app', function(req, res, next) {
    res.sendStatus(404);
});

module.exports = router;