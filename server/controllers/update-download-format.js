'use strict';

const { Logger } = require('../lib/logger');

const { DOWNLOAD_ARTICLE_FORMATS } = require('config');

const ALLOWED_FORMATS = Object.values(DOWNLOAD_ARTICLE_FORMATS).reduce((acc, val) => {
	acc[val] = val;

	return acc;
}, {});

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'controllers/update-download-format'});
	if (!(req.body.format in ALLOWED_FORMATS)) {
		throw new TypeError(`Invalid format ${req.body.format}`);
	}

	try {
		let { $DB: db, user } = res.locals;

		user.download_format = req.body.format;

		[user] = await db.syndication.upsert_user([user]);

		res.locals.user = user;

		log.debug(`Persisted user#${user.user_id} to DB`);

		const referrer = String(req.get('referrer'));
		const requestedWith = String(req.get('x-requested-with')).toLowerCase();

		if (referrer.endsWith('/republishing/contract') && (requestedWith !== 'xmlhttprequest' && !requestedWith.includes('fetch'))) {
			res.redirect(referrer);

			return;
		}
		else {
			res.sendStatus(204);
		}

		next();
	}
	catch(error) {
		log.error('UPDATE_DOWNLOAD_FORMAT_ERROR', {
			event: 'UPDATE_DOWNLOAD_FORMAT_ERROR',
			error
		});

		res.sendStatus(500);
	}
};
