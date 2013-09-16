'use strict';

var validation = require('./validation');

function Subscription(opts) {
    if(!(this instanceof Subscription)) {
        return new Subscription(opts);
    }
    this.client = opts.client;
    this.validate = validation(opts.validation);
}

Subscription.prototype.preview = function (opts, callback) {
    var errs = this.validate('subscriptionPreview', opts);
    if(errs) {
        setImmediate(function () {
            callback(errs);
        });
        return;
    }

    self.client.post('/subscriptions/preview', opts, callback);
};

Subscription.prototype.create = function (opts, callback) {
    var errs = this.validate('subscriptionCreate', opts);
    if(errs) {
        setImmediate(function () {
            callback(errs);
        });
        return;
    }

    self.client.post('/subscriptions', opts, callback);
};

Subscription.prototype.getByAccount = function (id, opts, callback) {

    if(!callback) {
        callback = opts;
        opts = false;
    }

    self.client.get('/subscriptions/accounts/' + id, opts, callback);
};

Subscription.prototype.getByKey = function (key, callback) {
    self.client.get('/subscriptions/' + key, callback);
};

Subscription.prototype.update = function (key, data, callback) {
    self.client.put('/subscriptions/' + key, data, callback);
};

Subscription.prototype.renew = function (key, data, callback) {
    self.client.put('/subscriptions/' + key + '/renew', data, callback);
};

Subscription.prototype.cancel = function (key, opts, callback) {
    var errs = this.validate('subscriptionCancel', opts);
    if(errs) {
        setImmediate(function () {
            callback(errs);
        });
        return;
    }

    self.client.put('/subscriptions/' + key + '/cancel', opts, callback);
};

module.exports = Subscription;