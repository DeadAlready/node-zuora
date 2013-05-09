'use strict';

var entries = {
    1: 'UI',
    2: 'SOAP API',
    3: 'Scheduled jobs',
    4: 'Asynchronous jobs',
    5: 'REST API',
    6: 'Forked thread',
    9: 'Unknown'
};

var objects = {
    '100': 'POSTAccount',
    '101': 'POSTAccountContact',
    '102': 'POSTAccountCreditCard',
    '103': 'POSTAccountCreditCardHolderInfo',
    '104': 'POSTAccountSubscription',
    '150': 'PUTAccount',
    '151': 'PUTAccountContact',
    '160': 'GETAccount',
    '161': 'GETAccountSummary',
    '200': 'POSTPaymentMethod',
    '250': 'PUTPaymentMethod',
    '260': 'GETPaymentMethods',
    '300': 'POSTSubscription',
    '301': 'POSTSrpCreate',
    '302': 'POSTScCreate',
    '310': 'POSTSubscriptionPreview',
    '311': 'POSTSubscriptionPreviewAccount',
    '312': 'POSTSubscriptionPreviewContact',
    '320': 'POSTSubscriptionCancellation',
    '330': 'POSTSubscriptionRenewal',
    '350': 'PUTSubscription',
    '351': 'PUTScAdd',
    '352': 'PUTScUpdate',
    '353': 'PUTSrpAdd',
    '354': 'PUTSrpUpdate',
    '355': 'PUTSrpRemove',
    '360': 'GETSubscriptions',
    '364': 'GETOneSubscription',
    '361': 'GETInvoices',
    '362': 'GETPayments',
    '363': 'GETUsages',
    '400': 'POSTInvoiceCollect',
    '401': 'CommonInvoiceCollectRequest',
    '402': 'CommonInvoiceRequest'
};

var categories = {
    '00': 'Unknown',
    '10': 'Permission or access denied',
    '11': 'Authentication failed',
    '20': 'Invalid format or value',
    '21': 'Unknown field in request',
    '22': 'Missing required field',
    '30': 'Rule restriction',
    '40': 'Not found',
    '50': 'Locking contention',
    '60': 'Internal error'
};

var fields = {
    POSTPaymentMethod: {
        '00': '_general',
        '01': 'accountKey',
        '02': 'creditCardType',
        '03': 'creditCardNumber',
        '04': 'expirationMonth',
        '05': 'expirationYear'
    },
    POSTAccount: {
        '00': '_general',
        '02': 'name',
        '03': 'currency',
        '09': 'paymentTerm',
        '11': 'billToContact',
        '14': 'creditCard'
    },
    POSTAccountCreditCard: {
        '01': 'creditCard.cardType',
        '02': 'creditCard.cardNumber',
        '03': 'creditCard.expirationMonth',
        '04': 'creditCard.expirationYear'
    },
    POSTAccountContact: {
        '07': 'billToContact.firstName',
        '08': 'billToContact.lastName'
    }
}

function splitError(code) {
    code = code + '';
    var entry = code.substr(0, 1);
    var object = code.substr(1, 3);
    var field = code.substr(4, 2);
    var category = code.substr(6, 2);

    var o = objects[object];
    return {
        entry: {
            name: entries[entry],
            nr: entry
        },
        object: {
            name: o,
            nr: object
        },
        field: {
            name: fields[o] && fields[o][field] || undefined,
            nr: field
        },
        category: {
            name: categories[category],
            nr: category
        }
    };
}

function translateError(code) {
    var c = splitError(code);

    return (c.entry.name + ': ' + c.object.name + ',' + (c.field.name || c.field.nr) + ' - ' + c.category.name);
}

module.exports.getHandler = function (callback) {
    return function (err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        if (typeof obj !== 'object' || obj.success === undefined) {
            callback(new TypeError('Invalid response'));
            return;
        }
        if(!obj.success) {
            var err = new Error('Zuora Internal error');
            obj.reasons.forEach(function (r, i) {
                obj.reasons[i].human = translateError(r.code);
                obj.reasons[i].split = splitError(r.code);
                err[obj.reasons[i].split.field.name] = (obj.reasons[i].split.category.nr === '30' ? r.message : obj.reasons[i].split.category.name);
                if(r.message === 'Expiration date must be a future date.') { // Hacking
                    err[obj.reasons[i].split.object.name === 'POSTAccount' ? 'creditCard.expirationMonth' : 'expirationMonth'] = r.message;
                    err[obj.reasons[i].split.object.name === 'POSTAccount' ? 'creditCard.expirationYear' : 'expirationYear'] = r.message;
                }
                console.log(r.message);
                console.log(r.message.indexOf('The credit card number is invalid.'));
                if(r.message.indexOf('The credit card number is invalid.') !== -1) {
                    err[obj.reasons[i].split.object.name === 'POSTPaymentMethod' ? 'creditCardNumber' : 'creditCard.cardNumber'] = r.message;
                    console.log(err);
                }
            });
            callback(err, obj);
            return;
        }
        callback(null, obj);
    }
};