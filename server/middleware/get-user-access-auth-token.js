'use strict';

const qs = require('querystring');
const { Logger } = require('../lib/logger');
const fetch = require('n-eager-fetch');
const createAuthorizationQueryString = require('../helpers/create-authorization-query-string');

const { BASE_URI_FT_API } = require('config');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'middleware/get-user-access-auth-token'});
	const { locals: {
		EXPEDITED_USER_AUTH,
		MAINTENANCE_MODE
	} } = res;

	if (MAINTENANCE_MODE !== true && EXPEDITED_USER_AUTH === true) {
		next();

		return;
	}
	const querystring = createAuthorizationQueryString('profile_min');

	const URI = `${BASE_URI_FT_API}/authorize?${querystring}`;

	try {
		const authRes = await fetch(URI, {
			headers: {
				'cookie': req.headers.cookie,
				'content-type': 'application/json'
			},
			redirect: 'manual',
			method: 'get'
		});
		const authResLocation = authRes.headers.get('location') || '';
		const authQuery = qs.parse(authResLocation.split('#').pop());

		if (!authQuery.access_token) {
			throw new ReferenceError(`No User Access Token returned for ${URI}`);
		}

		res.locals.ACCESS_TOKEN_USER = authQuery.access_token;

		next();
	}
	catch (error) {
		log.error('USER_ACCESS_TOKEN_ERROR', {
			event: 'USER_ACCESS_TOKEN_ERROR',
			error,
			URI
		});

		res.sendStatus(401);

		next(error);
	}
};
