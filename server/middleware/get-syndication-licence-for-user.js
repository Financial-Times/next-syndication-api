'use strict';

const hasGraphicsAccess = require('../helpers/has-graphics-access');
const { Logger } = require('../lib/logger');

const fetch = require('n-eager-fetch');

const {
	ALS_API_KEY,
	BASE_URI_FT_API,
	SYNDICATION_PRODUCT_CODE,
	TEST: { SKIP_LICENCE_ID, SKIP_SYNDICATION_CONTRACT_ID }
} = require('config');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({
		req,
		res,
		source: 'middleware/get-syndication-licence-for-user'
	});
	const URI = `${BASE_URI_FT_API}/licences?userid=${res.locals.userUuid}`;
	const headers = {
		'X-Api-Key': ALS_API_KEY
	};

	try {
		const licenceRes = await fetch(URI, { headers });

		const { accessLicences } = await licenceRes.json();

		let syndicationLicences = accessLicences.filter(
			({ products = [], status }) =>
				status === 'active' &&
				products.find(({ code }) => code === SYNDICATION_PRODUCT_CODE)
		);

		if (!syndicationLicences.length) {
			const isProduction = process.env.NODE_ENV === 'production';
			if (isProduction) {
				const error = new ReferenceError(
					`No Syndication Licence found for user#${res.locals.userUuid} using ${URI}`
				);
				log.error('LICENCE_FOUND_ERROR', {
					event: 'LICENCE_FOUND_ERROR',
					error,
					URI,
					headers,
					user: res.locals.userUuid
				});
				res.sendStatus(404);
				next(error);
			}

			syndicationLicences.push({
				id: SKIP_LICENCE_ID,
				links: [
					{
						href: 'NULL',
						id: SKIP_SYNDICATION_CONTRACT_ID,
						rel: 'complimentary'
					}
				]
			});
		}

		let syndicationLicence =
			syndicationLicences.length === 1
				? syndicationLicences[0]
				: syndicationLicences.find(
					(item) => item.links[0].rel !== 'complimentary'
				) || syndicationLicences[0];

		if (!syndicationLicence) {
			const error = new ReferenceError(
				`No Syndication Licence found for user#${res.locals.userUuid} using ${URI}`
			);
			log.error('LICENCE_FOUND_ERROR', {
				event: 'LICENCE_FOUND_ERROR',
				error,
				URI,
				headers,
				user: res.locals.userUuid
			});
			res.sendStatus(404);
			next(error);
		}

		res.locals.licence = syndicationLicence;
		res.locals.hasGraphicSyndication = hasGraphicsAccess(
			syndicationLicence.products
		);

		if (
			res.locals.MASQUERADING !== true ||
			!res.locals.syndication_contract
		) {
			res.locals.syndication_contract = syndicationLicence.links[0];
		}

		next();
	} catch (error) {
		// todo: if user is in out system and no longer has an syndication contract, remove them from DB
		log.error('LICENCE_FOUND_ERROR', {
			event: 'LICENCE_FOUND_ERROR',
			error,
			URI,
			headers,
			user: res.locals.userUuid
		});

		res.sendStatus(401);

		next(error);
	}
};
