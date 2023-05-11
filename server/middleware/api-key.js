'use strict';

const { EXTERNAL_SYNDICATION_API_KEY, SYNDICATION_API_KEY } = require('config');

module.exports = exports = async (req, res, next) => {
	res.locals.VALID_API_KEY = req.headers['x-api-key'] === SYNDICATION_API_KEY || req.headers['x-api-key'] === EXTERNAL_SYNDICATION_API_KEY;

	if (res.locals.VALID_API_KEY !== true) {
		res.sendStatus(403);

		return;
	}

	next();
};
