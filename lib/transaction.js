'use strict';

var validation = require('./validation');

function Transaction(opts) {
    if(!(this instanceof Transaction)) {
        return new Transaction(opts);
    }
    this.client = opts.client;
    this.validate = validation(opts.validation);
}

Transaction.prototype.getInvoices = function (id, opts, callback) {
    var self = this;
    if(!callback) {
        callback = opts;
        opts = false;
    }

    self.client.get('/rest/v1/transactions/invoices/accounts/' + id, opts, callback);
};

Transaction.prototype.getPayments = function (id, opts, callback) {
    var self = this;
    if(!callback) {
        callback = opts;
        opts = false;
    }

    self.client.get('/rest/v1/transactions/payments/accounts/' + id, opts, callback);
};

Transaction.prototype.collect = function (opts, callback) {
    var errs = this.validate('collect', opts);

    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }

    this.client.post('/rest/v1/operations/invoice-collect', opts, callback);
};

module.exports = Transaction;