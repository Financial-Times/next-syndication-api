'use strict';
const { Logger } = require('../lib/logger');
const pg = require('../../db/pg');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'middleware/db'});
	try {
		if (res.locals.MAINTENANCE_MODE !== true) {
			res.locals.$DB = await pg();
		}
		next();
	} catch(error) {
		log.error('DB_MIDDLEWARE_ERROR', {
			event: 'DB_MIDDLEWARE_ERROR',
			error
		});
		next(error);
	}
};
