'use strict';

const { Logger } = require('../lib/logger');
const Decoder = require('@financial-times/session-decoder-js');

const decoder = new Decoder(process.env.SESSION_PUBLIC_KEY);


module.exports = exports = (req, res, next) => {
	const log = new Logger({req, res, source: 'middleware/decode-session'});
	const sessionToken = req.cookies.FTSession;
	const sessionSecureToken = req.cookies.FTSession_s;
	if (!sessionToken || !sessionSecureToken) {
		res.redirect(`https://accounts.ft.com/login?location=${req.originalUrl}`);
		return;
	}

	try {
		res.locals.userUuid = decoder.decode(sessionToken);
		next();
	}
	catch (err) {
		log.error('DECODE_SESSION_ERROR', {
			event: 'DECODE_SESSION_ERROR',
			error: err,
		});

		// Dodgy session token provided
		return res.sendStatus(400);
	}
};
