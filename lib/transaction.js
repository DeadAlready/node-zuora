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

    self.client.get('/transactions/invoices/accounts/' + id, opts, callback);
};

Transaction.prototype.getPayments = function (id, opts, callback) {
    var self = this;
    if(!callback) {
        callback = opts;
        opts = false;
    }

    self.client.get('/transactions/payments/accounts/' + id, opts, callback);
};

Transaction.prototype.collect = function (opts, callback) {
    var errs = this.validate('collect', opts);

    if(errs) {
        setImmediate(function () {
            callback(errs);
        });
        return;
    }

    this.client.post('/operations/invoice-collect', opts, callback);
};

module.exports = Transaction;