'use strict';

var Client = require('./lib/client');
var Catalog = require('./lib/catalog');
var Payment = require('./lib/payment');
var Account = require('./lib/account');

function Zuora(options) {
    if(!(this instanceof Zuora)) {
        return new Zuora(options);
    }

    var client = new Client(options);

    this.catalog = new Catalog({client: client});
    this.account = new Account({client: client});
    this.payment = new Payment({client: client});
}

module.exports.create = function (opts) {
    return new Zuora(opts);
};