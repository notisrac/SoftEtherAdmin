/**
 * Memory cache middleware for express
 */

var memCache = require('memory-cache');

// original: https://glitch.com/edit/#!/server-side-cache-express

var cache = function (duration) {
    return function (req, res, next) {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedContent = memCache.get(key);
        if (cachedContent) {
            res.send(cachedContent);
            return;
        }
        else {
            res.sendResponse = res.send;
            res.send = function (body) {
                memCache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
}

module.exports = cache;