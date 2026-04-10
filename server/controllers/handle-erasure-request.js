'use strict';

const { Logger } = require('../lib/logger');

module.exports = exports = async (req, res) => {
	const log = new Logger({req, res, source: 'controllers/handle-erasure-request'});

	const {
		locals: { $DB: db },
	} = res;
	const { uuid, email } = req.body;
	const userIdentifier = uuid || email;

	if (!userIdentifier) {
		return res.status(400).json({
			error: 'Missing user identifier. Either uuid or email must be provided.',
		});
	}

	let userData;
	try {
		[userData] = await db.syndication.get_user([userIdentifier]);
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
		const [result] = await db.syndication.anonymise_user_subject_data([userData.user_id]);
		log.info('ERASURE_REQUEST_PROCESSED', {
			userUuid: userIdentifier,
			data: result?.anonymise_user_subject_data?.data,
		});
		return res.status(200).json(result?.anonymise_user_subject_data?.data || {});
	} catch (error) {
		log.error('ERASURE_REQUEST_FAILED_TO_ERASE_USER_DATA', {
			userUuid: userIdentifier,
			error,
		});
		return res.status(500).json({
			code: 'ERASURE_REQUEST_FAILED_TO_ERASE_USER_DATA',
			error: 'Failed to erase user data from the database.',
		});
	}
};
