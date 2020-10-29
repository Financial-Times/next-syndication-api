'use strict';

const { Logger } = require('../lib/logger');

const getContractByID = require('../lib/get-contract-by-id');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'middleware/get-contract-by-id-from-session'});
	const { locals } = res;
	const {
		$DB: db,
		MAINTENANCE_MODE,
		MASQUERADING,
		syndication_contract,
		user,
		licence,
		hasGraphicSyndication,
	} = locals;

	try {
		if (MAINTENANCE_MODE !== true) {
			const contract = locals.contract = await getContractByID(syndication_contract.id, locals);

			locals.allowed = locals.contract.allowed = contract.items.reduce((acc, { assets }) => {
				[
					['ft.com', 'ft_com'],
					['spanish content', 'spanish_content'],
					['spanish weekend', 'spanish_weekend']
				].forEach(([content_area, property]) => {
					acc[property] = acc[property] || assets.some(({ content }) => content.toLowerCase().includes(content_area));
				});

				return acc;
			}, {
				rich_articles: hasGraphicSyndication,
				contributor_content: contract.contributor_content
			});

			if (MASQUERADING !== true) {
				await db.syndication.upsert_contract_users([syndication_contract.id, user.user_id, contract.owner_email === user.email]);
			}
		}

		next();
	}
	catch (error) {
		log.error('getContractByID', {
			error: error,
			contractId: syndication_contract.id,
			userId: user.user_id,
			licenceId: licence.id,
		});

		res.sendStatus(400);
	}
};
