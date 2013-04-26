'use strict';

function Catalog(opts) {
    if(!(this instanceof Catalog)) {
        return new Catalog(opts);
    }
    this.client = opts.client;
    this.log = opts.log;
}

Catalog.prototype.get = function (opts, callback) {
    var self = this;
    if(!callback) {
        callback = opts;
        opts = false;
    }

    self.client.get('/rest/v1/catalog/products', opts, function (err, obj) {
        if(err) {
            self.log.error('Failed to get catalog', err);
        }
        callback(err, obj);
    });
};

module.exports = Catalog;