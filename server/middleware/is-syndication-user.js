'use strict';

const path = require('path');

const log = require('../lib/logger');
const fetch = require('n-eager-fetch');

const {
	SYNDICATION_PRODUCT_CODE,
	GRAPHIC_SYNDICATION_PRODUCT_CODE
} = require('config');

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = async (req, res, next) => {
	try {
		const { locals: {
			$DB: db,
			EXPEDITED_USER_AUTH,
			MAINTENANCE_MODE,
			userUuid
		} } = res;

		let isSyndicationUser = false;

		const headers = { cookie: req.headers.cookie };
		const sessionRes = await fetch('https://session-next.ft.com/products', { headers });
		let session;
		if (sessionRes.ok) {
			session = await sessionRes.json();
			const products = session.products.split(',');

			isSyndicationUser = session.uuid === userUuid && products.includes(SYNDICATION_PRODUCT_CODE);
			res.locals.hasGraphicSyndication = products.includes(GRAPHIC_SYNDICATION_PRODUCT_CODE);
		} 

		if (MAINTENANCE_MODE !== true) {
			if (EXPEDITED_USER_AUTH === true) {
				log.info('expediting-syndication-user-check', { uuid: userUuid });
				next();

				return;
			}

			const [dbUser] = await db.syndication.get_user([userUuid]);

			if (dbUser && dbUser.user_id === userUuid) {
				log.info(`${MODULE_ID} IsSyndicationUserSuccess`, { isSyndicationUser });
				next();
				return
			}
		}

		if (sessionRes.ok) {
			log.info('no-syndication-database-user-result', { uuid: userUuid, isSyndicationUser, maintenance: MAINTENANCE_MODE });
			if (isSyndicationUser === true) {
				next();
				return;
			}
		}

		if (!sessionRes.ok) {
			const isProduction = process.env.NODE_ENV === 'production';
			if (!isProduction) {
				next();

				return;
			}
		}

		log.error('no-syndication-user', { uuid: userUuid });
		res.sendStatus(401);
	}
	catch (error) {
		log.error({
			event: 'IS_SYNDICATION_USER_ERROR',
			error
		});

		res.sendStatus(503);

		throw error;
	}
};
