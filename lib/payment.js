'use strict';

var validate = require('./validate');

function Payment(options) {
    if(!(this instanceof Payment)) {
        return new Payment(options);
    }

    this.client = options.client;
}

Payment.prototype.create = function(data, callback) {
    var err = validate('paymentCreate', data);
    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }

    var path = '/rest/v1/payment-methods/credit-cards';

    this.client.post(path, data, callback);
};

Payment.prototype.get = function (account, opts, callback) {
    if(!callback) {
        callback = opts;
        opts = false;
    }

    var path = '/rest/v1/payment-methods/credit-cards/accounts/' + account;
    this.client.get(path, opts, callback);
};

Payment.prototype.update = function (id, data, callback) {
    var path = '/rest/v1/payment-methods/credit-cards/' + id;
    var err = validate('paymentUpdate', data);
    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }
    this.client.put(path, data, callback);
};

Payment.prototype.del = function (id, callback) {
    var path = '/rest/v1/payment-methods/' + id;

    this.client.del(path, callback);
};

module.exports = Payment;