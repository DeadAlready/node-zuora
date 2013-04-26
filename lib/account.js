'use strict';

function Account(options) {
    if(!(this instanceof Account)){
        return new Account(options);
    }
    this.client = options.client;

}

Account.prototype.create = function (options, callback) {

};

module.exports = Account;