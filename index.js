'use strict';

var Client = require('./lib/client');
var Catalog = require('./lib/catalog');

function Zuora(options) {
    if(!(this instanceof Zuora)) {
        return new Zuora(options);
    }

    var client = new Client(options);

    this.catalog = new Catalog({client: client});
}

module.exports.create = function (opts) {
    return new Zuora(opts);
};