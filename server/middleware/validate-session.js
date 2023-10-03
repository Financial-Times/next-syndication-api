'use strict';

const { Logger } = require('../lib/logger');
const fetch = require('n-eager-fetch');

const sessionAPI = 'https://session-next.ft.com/sessions/s/';

async function validateSession (secureSessionToken) {

	const sessionEndpoint = `${sessionAPI}${secureSessionToken}`;

	const fetchResponse = await fetch(sessionEndpoint, {
		headers: {
			method: 'GET',
			accept: 'application/json'
		}
	});

	if (!fetchResponse.ok) {
		const error = new Error(fetchResponse.status === 404 ? 'notFound' : 'failedToGetData');
		throw error;
	}

	try {
		return await fetchResponse.json();
	}
	catch (error) {
		throw error;
	}
}

module.exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'middleware/validate-session'});

	const secureSessionToken = req.cookies.FTSession_s;

    if (!secureSessionToken) {
		res.redirect(`https://accounts.ft.com/login?location=${req.originalUrl}`);
		return;
	}

	try {
		const { uuid } = await validateSession(secureSessionToken);
		res.locals.userUuid = uuid;
		return next();
	}
	catch (error) {
		error.message = error.message.replaceAll(secureSessionToken, 'user-session');
		log.error('VALIDATE_SESSION_ERROR', {
			event: 'VALIDATE_SESSION_ERROR',
			error: error,
		});
		
		return res.sendStatus(400);
	}
};