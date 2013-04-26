'use strict';

function Catalog(opts) {
    if(!(this instanceof Catalog)) {
        return new Catalog(opts);
    }
    this.client = opts.client;
}

Catalog.prototype.get = function (opts, callback) {
    var self = this;
    if(!callback) {
        callback = opts;
        opts = false;
    }

    self.client.get('/rest/v1/catalog/products', opts, callback);
};

module.exports = Catalog;