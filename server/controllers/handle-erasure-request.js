'use strict';

const { Logger } = require('../lib/logger');

module.exports = exports = async (req, res) => {
	const log = new Logger({req, res, source: 'controllers/handle-erasure-request'});

	const {
		locals: { $DB: db },
	} = res;
	const { uuid, email } = req.body;
	const userUuid = uuid || email;

	if (!userUuid) {
		return res.status(400).json({
			error: 'Missing user identifier. Either uuid or email must be provided.',
		});
	}

	let userData;
	try {
		[userData] = await db.syndication.get_user([userUuid]);
		if (!userData.user_id) {
			return res.sendStatus(404);
		}
	}	catch (error) {
		log.error('ERASURE_REQUEST_FAILED_TO_GET_USER_DATA', {
			error,
		});
		return res.status(500).json({
			code: 'ERASURE_REQUEST_FAILED_TO_GET_USER_DATA',
			error: 'Failed to retrieve user data from the database.',
		});
	}

	try {
		// TODO: Remove user data from the database
		// probably a set of functions in db schema

		log.info('ERASURE_REQUEST_PROCESSED', { userUuid });
		return res.sendStatus(204);
	} catch (error) {
		log.error('ERASURE_REQUEST_FAILED_TO_ERASE_USER_DATA', {
			error,
		});
		return res.status(500).json({
			code: 'ERASURE_REQUEST_FAILED_TO_ERASE_USER_DATA',
			error: 'Failed to erase user data from the database.',
		});
	}
};
