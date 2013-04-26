'use strict';

var validate = require('./validation');

function Account(options) {
    if(!(this instanceof Account)){
        return new Account(options);
    }

    this.client = options.client;
}

Account.prototype.create = function (data, callback) {
    var err = validate('accountCreate', data);
    if(err) {
        setImmediate(function () {
            callback(err);
        });
        return;
    }

    this.client.post('/rest/v1/accounts', data, callback);
};

Account.prototype.get = function (id, callback) {
    var path = '/rest/v1/accounts/' + id;

    this.client.get(path, callback);
};

Account.prototype.getSummary = function (id, callback) {
    var path = '/rest/v1/accounts/' + id + '/summary';

    this.client.get(path, callback);
};

Account.prototype.update = function (id, data, callback) {
    var path = '/rest/v1/accounts/' + id;

    this.client.put(path, data, callback);
};

module.exports = Account;