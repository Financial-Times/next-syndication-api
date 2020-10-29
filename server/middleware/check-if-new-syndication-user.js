const { Logger } = require('../lib/logger');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'middleware/check-if-new-syndication-user'});

	const { locals: {
		EXPEDITED_USER_AUTH,
		MAINTENANCE_MODE,
		userUuid
	} } = res;

	if (MAINTENANCE_MODE !== true && EXPEDITED_USER_AUTH !== true) {
		res.set('FT-New-Syndication-User', 'true');
		log.info('new-syndication-user', { uuid: userUuid })
		res.locals.isNewSyndicationUser = true;
	}

	next();

};
