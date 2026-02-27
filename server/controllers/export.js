'use strict';

const { Logger } = require('../lib/logger');

const { EXPORT } = require('config');

const RE_QUOTES = /"/gm;
const DOWNLOADS_EXPORT_SQL = 'SELECT * FROM syndication.get_downloads_by_contract_id($1::text)';
const SAVED_ITEMS_EXPORT_SQL = 'SELECT * FROM syndication.get_saved_items_by_contract_id($1::text)';

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'controllers/export'});
	const START = Date.now();

	try {
		const { locals: {
			$DB: db,
			contract: CONTRACT
		} } = res;

		let type = req.query.type || 'downloads';

		const EXPORT_HEADERS = EXPORT[type];
		let sqlQuery;

		if (type === 'downloads') {
			sqlQuery = DOWNLOADS_EXPORT_SQL;
		}
		else if (type === 'saved_items') {
			sqlQuery = SAVED_ITEMS_EXPORT_SQL;
		}

		if (!EXPORT_HEADERS || !sqlQuery) {
			throw new TypeError(`Invalid Export Type: '${type}'`);
		}

		res.attachment(`export_republishing_${type}_${(new Date()).toJSON()}.csv`);

		const items = await db.query(sqlQuery, [CONTRACT.contract_id]);

		const CSV = [];

		CSV.push(Object.keys(EXPORT_HEADERS).map(key => EXPORT_HEADERS[key]).join(','));

		CSV.push(...items.map(item => Object.keys(EXPORT_HEADERS).map(key => safe(item, key)).join(',')));

		res.send(Buffer.from(CSV.join('\n'), 'utf8'));

		res.status(200);

		log.debug(`exported ${CSV.length} items in ${Date.now() - START}ms`);

		next();
	}
	catch(error) {
		log.error('EXPORT_ERROR', {
			event: 'EXPORT_ERROR',
			error
		});

		res.sendStatus(400);
	}

};

function safe(item, key) {

	let value = item[key];

	switch (Object.prototype.toString.call(value)) {
		case '[object Date]':
			value = value.toJSON();
			break;

		case '[object Array]':
		case '[object Object]':
			value = JSON.stringify(value).replace(RE_QUOTES, '\"');
			break;
	}

	// Sets value for content_type to 'rich_article' when item has graphics
	if (key === 'content_type' && value === 'article' && item.has_graphics){
		value = 'rich_article';
	}

	if (String(value).includes(',')) {
		return `"${value}"`;
	}

	return value;
}
