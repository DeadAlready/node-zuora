'use strict';

var countries = require('./validation/countries');
var states = require('./validation/states');
var currencies = require('./validation/currencies');

var check = require('validator').check;

var validationObjects = {
    creditCardType: {
        notEmpty: [],
        isIn : [['Visa','AmericanExpress','MasterCard','Discover']]
    },
    creditCardNumber: {
        notEmpty: [],
        isCreditCard: []
    },
    expirationMonth: {
        notEmpty: [],
        len: [2, 2],
        isNumeric: [],
        min: [1],
        max: [12]
    },
    expirationYear: {
        notEmpty: [],
        len: [4, 4],
        isNumeric: [],
        min: [2000],
        max: [2030]
    },
    securityCode: {
        notEmpty: [],
        len: [3,3]
    },
    cardHolderName: {
        notEmpty: []
    },
    city: {
        notEmpty: []
    },
    country: {
        isIn: [countries.all]
    },
    state: function (data) {
        var validate = {
            notEmpty: []
        };
        if(data['country'] === 'Canada' || data['country'] === 'CAN') {
            validate.isIn = [states.canada.all]
        } else if(data['country'] === 'United States' || data['country'] === 'USA') {
            validate.isIn = [states.us.all]
        }
        return validate;
    },
    zipcode: {
        notEmpty: []
    }
};

var validationRules = {
    paymentCreate: {
        accountKey: {
            notEmpty: []
        },
        creditCardType: validationObjects.creditCardType,
        creditCardNumber: validationObjects.creditCardNumber,
        expirationMonth: validationObjects.expirationMonth,
        expirationYear: validationObjects.expirationYear,
        securityCode: validationObjects.securityCode,
        cardHolderName: validationObjects.cardHolderName,
        city: validationObjects.city,
        country: validationObjects.country,
        state: validationObjects.state,
        zipcode: validationObjects.zipcode
    },
    paymentUpdate: {
        expirationMonth: validationObjects.expirationMonth,
        expirationYear: validationObjects.expirationYear,
        securityCode: validationObjects.securityCode,
        cardHolderName: validationObjects.cardHolderName,
        city: validationObjects.city,
        country: validationObjects.country,
        state: validationObjects.state,
        zipcode: validationObjects.zipcode
    },
    accountCreate: {
        accountNumber: {
            notEmpty: []
        },
        name: {
            notEmpty: []
        },
        currency: {
            notEmpty: [],
            isIn: [currencies.all]
        },
        paymentTerm: {
            notEmpty: [],
            isIn: [[ 'Due Upon Receipt', 'Net 30', 'Net 60', 'Net 90']]
        },
        billToContact: {
            notNull: [],
            subObjects: {
                firstName: {
                    notEmpty: []
                },
                lastName: {
                    notEmpty: []
                }
            }
        }
    }
};

module.exports = function (type, data) {
    return null;
    if(typeof data !== 'object') {
        return new TypeError('Input data missing');
    }

    var allRules = validationRules[type];

    if(!allRules) {
        return null;
    }

    var errors = [];

    function checkCycle(obj, rules, pre) {
        Object.keys(rules).forEach(function (name) {
            var rule;
            if(typeof rules[name] === 'function') {
                rule = rules[name](obj);
            } else {
                rule = rules[name];
            }
            Object.keys(rule).some(function (fn) {
                if(fn !== 'subObjects') {
                    try {
                        if(rule[fn].length) {
                            var a = check(obj[name]);
                            a[fn].apply(a, rule[fn]);
                        } else {
                            check(obj[name])[fn]();
                        }
                    } catch (e) {
                        errors.push({name: (pre ? pre + '.' + name : name), message: e.message, fn: fn, v: obj[name]});
                        return true;
                    }
                } else {
                    checkCycle(obj[name], rules[fn], (pre ? pre + '.' + name : name));
                }
                return false;
            });
        });
    }

    checkCycle(data, allRules);

    var ret = null;

    if(errors.length) {
        ret = {};
        errors.forEach(function (err) {
            ret[err.name] = err.message;
        });
    }


    return ret;
};