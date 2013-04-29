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
    'POSTPaymentMethod': {
        '01': 'accountKey',
        '03': 'creditCardNumber'
    }
}

function translateError(code) {
    var c = splitError(code);

    return (c.entry.name + ': ' + c.object.name + ',' + (c.field.name || c.field.nr) + ' - ' + c.category.name);
};

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
            obj.reasons.forEach(function (r, i) {
                obj.reasons[i].human = translateError(r.code);
                obj.reasons[i].split = splitError(r.code);
            });
            callback(new Error('Zuora Internal error'), obj);
            return;
        }
        callback(null, obj);
    }
};