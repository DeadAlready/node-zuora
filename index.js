'use strict';

var restify = require('restify');
var assert = require('assert');
var ZuoraClient = require('./lib/client');

module.exports.create = function (opts) {

    assert.ok((opts && typeof opts === 'object'), 'opts must be an object');
//    assert.ok(opts.tenant, 'opts.tenant must be defined');
    assert.ok(opts.user, 'opts.apiKey must be defined');
    assert.ok(opts.password, 'opts.apiSecret must be defined');

    var client = restify.createJsonClient({
        url: opts.production ? 'https://api.zuora.com' : 'https://apisandbox-api.zuora.com',

    });
    client.basicAuth(opts.user, opts.password);

    var options = {
        client: client
    };

    return new ZuoraClient(options);
};