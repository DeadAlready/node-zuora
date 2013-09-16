'use strict';

var validation = require('./validation');

function Payment(options) {
    if(!(this instanceof Payment)) {
        return new Payment(options);
    }

    this.client = options.client;
    this.validate = validation(options.validation);
}

Payment.prototype.create = function(data, callback) {
    var err = this.validate('paymentCreate', data);
    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }

    this.client.post('/payment-methods/credit-cards', data, callback);
};

Payment.prototype.get = function (account, opts, callback) {
    if(!callback) {
        callback = opts;
        opts = false;
    }
    this.client.get('/payment-methods/credit-cards/accounts/' + account, opts, callback);
};

Payment.prototype.update = function (id, data, callback) {
    var err = this.validate('paymentUpdate', data);
    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }
    this.client.put('/payment-methods/credit-cards/' + id, data, callback);
};

Payment.prototype.del = function (id, callback) {
    this.client.del('/payment-methods/' + id, callback);
};

module.exports = Payment;