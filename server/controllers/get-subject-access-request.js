'use strict';

const { Logger } = require('../lib/logger');

module.exports = exports = async (req, res) => {
	const log = new Logger({
		req,
		res,
		source: 'controllers/get-subject-access-request',
	});

	try {
		const {
			locals: { $DB: db },
		} = res;
		const { uuid, email } = req.body;
		const userIdentifier = uuid || email;

		if (!userIdentifier) {
			return res.status(400).json({
				code: 'GDPR_SUBJECT_ACCESS_REQUEST_MISSING_USER_IDENTIFIER',
				error: 'Missing user identifier. Either uuid or email must be provided in the request\'s body.',
			});
		}

		const [result] = await db.syndication.get_user_subject_access_data([
			userIdentifier,
		]);

		if (
			result?.get_user_subject_access_data?.data?.syndicationUserData
				?.user
		) {
			log.info('GDPR_SUBJECT_ACCESS_REQUEST_PROCESSED', { userIdentifier });
			return res.status(200).json(result.get_user_subject_access_data);
		} else {
			log.info('GDPR_SUBJECT_ACCESS_REQUEST_USER_NOT_FOUND', {
				userIdentifier,
			});
			return res.sendStatus(404);
		}
	} catch (error) {
		log.error('GDPR_SUBJECT_ACCESS_REQUEST_FAILED_TO_GET_USER_DATA', {
			event: 'GDPR_SUBJECT_ACCESS_REQUEST_FAILED_TO_GET_USER_DATA',
			error,
		});
		return res.status(500).json({
			code: 'GDPR_SUBJECT_ACCESS_REQUEST_FAILED_TO_GET_USER_DATA',
			error: 'Failed to retrieve user data from the database.',
		});
	}
};
