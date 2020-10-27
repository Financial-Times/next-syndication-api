'use strict';

module.exports = exports = (arrayOfObjects, key = 'id') =>
	(arrayOfObjects || []).reduce((acc, obj) => {
		acc[obj[key]] = obj;
		return acc;
	}, {});
