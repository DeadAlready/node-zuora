'use strict';

var validate = {
    paymentCreate: ['accountKey', 'creditCardType', 'creditCardNumber', 'expirationMonth', 'expirationYear'],
    paymentUpdate: ['expirationMonth', 'expirationYear', 'securityCode', 'cardHolderName','city','state','zipcode','country'],
    accountCreate: ['accountNumber', 'name', 'currency','paymentTerm', {
        name: 'billToContact',
        fields: ['firstName','lastName']
    }]
};

module.exports = function (type, data) {
    if(typeof data !== 'object') {
        return new TypeError('Input data missing');
    }

    var err = [];
    function validateCycle(arr, data) {
        arr.forEach(function (el, i) {
            if(typeof el === 'string') {
                if(!data[el]){
                    err.push(new TypeError(el + ' is required'));
                }
            } else if (!data[el.name]){
                err.push(new TypeError(el + ' is required'));
            } else {
                validateCycle(el.fields, data[el.name]);
            }
        });
    }
    if(validate[type]){
        validateCycle(validate[type], data);
        if(err.length) {
            return err;
        }
    }
    return false;
}