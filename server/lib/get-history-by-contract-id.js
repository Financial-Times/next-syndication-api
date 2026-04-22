'use strict';

const moment = require('moment');
const pg = require('../../db/pg');
const getAllExistingItemsForContract = require('./get-all-existing-items-for-contract');
const { Logger } = require('./logger');
const log = new Logger({source: 'lib/get-history-by-contract-id'});

module.exports = exports = async ({ contract_id, limit, offset, type, user_id }) => {
	try {
		const db = await pg();

		let query = 'SELECT * FROM syndication.';
		let totalQuery = 'SELECT count(*) FROM syndication.';
		const queryParams = [];

		switch (type) {
			case 'saved':
				query += 'get_saved_items_by_contract_id(';
				totalQuery += 'saved_items';

				break;
			default:
				query += 'get_downloads_by_contract_id(';
				totalQuery += 'downloads';

				break;
		}

		// This generates an SQL query based on the parameters passed to the function.
		// The contract_id is required, while user_id, offset and limit are optional.
		// The query will look something like this:
		// SELECT * FROM syndication.get_downloads_by_contract_id($1::text, $2::text, $3::integer, $4::integer);
		// WHERE $1 is the contract_id, $2 is the user_id (if provided), $3 is the offset (if provided) and $4 is the limit (if provided).
		queryParams.push(contract_id);
		query += `$${queryParams.length}::text`;

		totalQuery += ' history WHERE history.contract_id = $1::text';

		if (typeof user_id !== 'undefined') {
			queryParams.push(user_id);
			query += `, $${queryParams.length}::text`;
		}

		if (typeof offset !== 'undefined') {
			queryParams.push(offset);
			query += `, $${queryParams.length}::integer`;
		}

		if (typeof limit !== 'undefined') {
			queryParams.push(limit);
			query += `, $${queryParams.length}::integer`;
		}

		query += ');';

		const items = await db.query(query, queryParams);
		const [totalRes] = await db.query(totalQuery, [contract_id]);
		const total = parseInt(totalRes.count, 10);
		const allExisting = await getAllExistingItemsForContract(contract_id);

		await items.filter(item => item.iso_lang_code === 'es').forEach(async item => {
			const query = 'SELECT * FROM syndication.get_content_es_by_id($1::uuid)';
			const [content] = await db.query(query, [item.content_id]);
			item.content_area = content.content_area;
		});

		items.forEach(item => {
			const existing = allExisting[item.content_id];

			item.downloaded = existing.downloaded;
			item.saved = existing.saved;

			item.id = item.content_id.split('/').pop();

			item.date = moment(item.time).format('DD MMMM YYYY');

			item.published = moment(item.published_date).format('DD MMMM YYYY');
		});

		return { items, total };
	} catch (error) {
		log.error('GET_HISTORY_BY_CONTRACT_ID_FAILED', {
			event: 'GET_HISTORY_BY_CONTRACT_ID_FAILED',
			error
		});
	}
};
