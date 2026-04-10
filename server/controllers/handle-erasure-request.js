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
			code: 'ERASURE_REQUEST_MISSING_USER_IDENTIFIER',
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

	const uuidToAnonymise = userData.user_id;
	try {
		const [result] = await db.syndication.anonymise_user_subject_data([uuidToAnonymise]);
		if (result?.anonymise_user_subject_data?.data?.anonymised) {
			const { counts, anonymised_user_id } = result.anonymise_user_subject_data.data;
			log.info('ERASURE_REQUEST_PROCESSED', {
				counts,
				anonymised_user_id,
			});
			return res.status(200).json({
				counts,
				anonymised_user_id,
			});
		} else {
			const { counts, original_user_id, reason } = result.anonymise_user_subject_data.data;
			log.warn('ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA', {
				code: 'ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA',
				error: reason || 'Failed to anonymise user data from the database.',
				counts,
				original_user_id,
			});
			return res.status(500).json({
				code: 'ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA',
				error: reason || 'Failed to anonymise user data from the database.',
				counts,
				original_user_id,
			});
		}
	} catch (error) {
		log.error('ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA', {
			userUuid: uuidToAnonymise,
			error,
		});
		return res.status(500).json({
			code: 'ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA',
			error: 'Failed to anonymise user data from the database.',
		});
	}
};
