'use strict';

var validation = require('./validation');

function Account(options) {
    if(!(this instanceof Account)){
        return new Account(options);
    }

    this.client = options.client;
    this.validate = validation(options.validation);
}

Account.prototype.create = function (data, callback) {
    var err = this.validate('accountCreate', data);
    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }

    this.client.post('/accounts', data, callback);
};

Account.prototype.get = function (id, callback) {
    this.client.get('/accounts/' + id, callback);
};

Account.prototype.getSummary = function (id, callback) {
    this.client.get('/accounts/' + id + '/summary', callback);
};

Account.prototype.update = function (id, data, callback) {
    this.client.put('/accounts/' + id, data, callback);
};

module.exports = Account;