'use strict';

const { Logger } = require('../lib/logger');

const ACL = {
	user: false,
	superuser: false,
	superdooperuser: true
};

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'controllers/reload'});
	const { locals: { $DB: db, user } } = res;

	try {
		if (!user || ACL[user.role] !== true) {
			res.sendStatus(403);

			return;
		}

		await db.query('SELECT syndication.reload_all()');

		res.sendStatus(204);

		next();
	}
	catch(error) {
		log.error('RELOAD_ERROR', {
			event: 'RELOAD_ERROR',
			error
		});

		res.sendStatus(500);
	}
};
