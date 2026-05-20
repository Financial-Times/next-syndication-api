'use strict';

const { GDPR_API_ACCESS_KEY } = require('config');

module.exports = exports = async (req, res, next) => {
	const hasValidGdprApiKey = req.headers['x-api-key'] === GDPR_API_ACCESS_KEY;

	if (!hasValidGdprApiKey) {
		res.sendStatus(403);

		return;
	}

	next();
};
