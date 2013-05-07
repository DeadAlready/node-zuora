'use strict';

var valid = require('./lib/validation');

console.log(valid('paymentCreate', {}));
console.log(valid('paymentCreate', {expirationMonth: '1'}));
console.log(valid('paymentCreate', {expirationMonth: '01'}));
console.log(valid('paymentCreate', {expirationMonth: '13'}));
console.log(valid('paymentCreate', {expirationMonth: '13', creditCardType: 'Juhan'}));
console.log(valid('paymentCreate', {expirationMonth: '13', creditCardType: 'Visa'}));
console.log(valid('paymentCreate', {expirationMonth: '13', creditCardType: 'MasterCard', creditCardNumber:'5678323422221111'}));
console.log(valid('paymentCreate', {expirationMonth: '13', creditCardType: 'MasterCard', creditCardNumber:'6011013397750131'}));