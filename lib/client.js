'use strict';

var assert = require('assert');
var restify = require('restify');
var error = require('./error');
var query = require('querystring');

function ZuoraClient(opts) {
    if(!(this instanceof ZuoraClient)) {
        return new ZuoraClient(opts);
    }

    assert.ok((opts && typeof opts === 'object'), 'opts must be an object');
    assert.ok(opts.user, 'opts.apiKey must be defined');
    assert.ok(opts.password, 'opts.apiSecret must be defined');

    var client = restify.createJsonClient({
        url: opts.production ? 'https://api.zuora.com' : 'https://apisandbox-api.zuora.com'
    });

    client.basicAuth(opts.user, opts.password);

    this.client = client;
}

ZuoraClient.prototype.get = function (path, opts, callback) {
    if(!callback) {
        callback = opts;
        opts = false;
    }
    if(opts) {
        path += '?' + query.stringify(opts);
    }
    this.client.get(path, error.getHandler(callback));
};

ZuoraClient.prototype.del = function (path, opts, callback) {
    if(!callback) {
        callback = opts;
        opts = false;
    }
    if(opts) {
        path += '?' + query.stringify(opts);
    }
    this.client.del(path, error.getHandler(callback));
};

ZuoraClient.prototype.put = function (path, object, callback) {
    this.client.put(path, object, error.getHandler(callback));
};

ZuoraClient.prototype.post = function (path, object, callback) {
    this.client.post(path, object, error.getHandler(callback));
};

module.exports = ZuoraClient;