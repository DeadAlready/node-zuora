'use strict';

var restify = require('restify');
var Catalog = require('./catalog');

function ZuoraClient(options) {
    if(!(this instanceof ZuoraClient)) {
        return new ZuoraClient(options);
    }

    this.client = options.client;
    this.catalog = new Catalog({client: this.client});
}

module.exports = ZuoraClient;