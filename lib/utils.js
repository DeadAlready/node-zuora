'use strict';

var util = require('util');

module.exports = util;

module.exports.cleanLogObject = function cleanLogObject(object) {
	if(typeof object !== 'object') {
		return object;
	}
	var cleanObj = {};
	Object.keys(object).forEach(function (key) {
		if(typeof object[key] === 'object') {
			cleanObj[key] = cleanLogObject(object[key]);
		} else {
			if(key === 'creditCardNumber') {
				var card = object[key];
				card.replace(/\s/g, '');
				var clean = '';
				for(var i = 0; i < (card.length - 4); i++) {
					clean += '*';
				}
				clean += card.substr(card.length - 4);
				cleanObj[key] = clean;
			} else if(key === 'securityCode') {
				var cleanSec = '';
				for(var i = 0; i < object[key].length; i++) {
					cleanSec += '*';
				}
				cleanObj[key] = cleanSec;
			} else {
				cleanObj[key] = object[key];
			}
		}
	});
	return cleanObj;
};