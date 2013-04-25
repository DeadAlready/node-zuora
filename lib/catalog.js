'use strict';

function Catalog(opts) {
    if(!(this instanceof Catalog)) {
        return new Catalog(opts);
    }
    this.client = opts.client;
    this.log = opts.log;
}

Catalog.prototype.get = function (callback) {
    var self = this;

    self.client.get('/rest/v1/catalog/products', function (err, req, res, obj) {
        if(err) {
            self.log.error('Failed to get catalog', err);
        }
        console.log(arguments);
        callback(err, obj);
    });
};

module.exports = Catalog;