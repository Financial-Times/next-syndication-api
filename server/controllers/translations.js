'use strict';

const moment = require('moment');

const getAllExistingItemsForContract = require('../lib/get-all-existing-items-for-contract');
const getContent = require('../lib/get-content');
const enrich = require('../lib/enrich');
const syndicate = require('../lib/syndicate-content');

const {
	DB: { DATE_FORMAT: DB_DATE_FORMAT }
} = require('config');

/**
 * Add a parameterized query clause to the provided clauses and params arrays
 * to prevent SQL injection vulnerabilities.
 * @param {Object} options - The options for the query clause.
 * @param {Array<string>} options.clauses - The array of parameterized query clauses.
 * @param {Array<*>} options.params - The array of query parameters.
 * @param {string} options.columnName - The name of the column.
 * @param {*} options.value - The value of the query parameter.
 * @param {string} options.type - The type of the value.
 */
const addQueryClause = ({ clauses, params, columnName, value, type }) => {
	params.push(value);
	clauses.push(`${columnName} => $${params.length}::${type}`);
};

/**
 * Parse an integer from the provided value, returning a fallback value if parsing fails.
 * @param {*} value - The value to parse.
 * @param {*} fallbackValue - The fallback value to return if parsing fails.
 * @returns {number} - The parsed integer or the fallback value.
 */
const parseIntegerWithFallback = (value, fallbackValue) => {
	const parsedValue = parseInt(value, 10);

	return Number.isNaN(parsedValue) ? fallbackValue : parsedValue;
};

module.exports = exports = async (req, res, next) => {
	let { query: {
		area,
		field,
		from: date_from,
		lang = 'es',
		limit = 50,
		offset = 0,
		order,
		query,
		sort,
		to: date_to
	} } = req;

	const { locals } = res;
	const { $DB: db, allowed, contract } = locals;

	const content_areas = {};

	switch (lang.toLowerCase()) {
		case 'es':
			if (allowed.spanish_content === true || allowed.spanish_weekend === true) {
				if (typeof area === 'string' && area.length) {
					area = [area.trim().toLowerCase()];
				}
				if (Array.isArray(area) && area.length) {
					if (area.includes('sc')) {
						content_areas['Spanish content'] = true;
					}
					if (area.includes('sw')) {
						content_areas['Spanish weekend'] = true;
					}
				}

				const getQueryClauses = [];
				const getTotalQueryClauses = [];
				const getQueryParams = [];
				const getTotalQueryParams = [];

				const normalizedOffset = parseIntegerWithFallback(offset, 0);
				const normalizedLimit = parseIntegerWithFallback(limit, 50);

				if (typeof query === 'string' && query.trim().length) {
					const normalizedQuery = query.trim();

					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'query', value: normalizedQuery, type: 'text' });
					addQueryClause({ clauses: getTotalQueryClauses, params: getTotalQueryParams, columnName: 'query', value: normalizedQuery, type: 'text' });
				}
				if (typeof date_from === 'string' && date_from.length) {
					const normalizedDateFrom = moment(date_from.trim()).format(DB_DATE_FORMAT);

					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'date_from', value: normalizedDateFrom, type: 'timestamp with time zone' });
					addQueryClause({ clauses: getTotalQueryClauses, params: getTotalQueryParams, columnName: 'date_from', value: normalizedDateFrom, type: 'timestamp with time zone' });
				}
				if (typeof date_to === 'string' && date_to.length) {
					const normalizedDateTo = moment(date_to.trim()).format(DB_DATE_FORMAT);

					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'date_to', value: normalizedDateTo, type: 'timestamp with time zone' });
					addQueryClause({ clauses: getTotalQueryClauses, params: getTotalQueryParams, columnName: 'date_to', value: normalizedDateTo, type: 'timestamp with time zone' });
				}
				if (typeof field === 'string') {
					field = field.trim().toLowerCase();

					if (field === 'published') {
						field = 'published_date';
					}
					else {
						field = 'translated_date';
					}

					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'date_col', value: field, type: 'text' });
					addQueryClause({ clauses: getTotalQueryClauses, params: getTotalQueryParams, columnName: 'date_col', value: field, type: 'text' });
				}

				const areas = Object.keys(content_areas);

				if (areas.length) {
					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'areas', value: areas, type: 'syndication.enum_content_area_es[]' });
					addQueryClause({ clauses: getTotalQueryClauses, params: getTotalQueryParams, columnName: 'areas', value: areas, type: 'syndication.enum_content_area_es[]' });
				}

				// Sort, Order, Offset and Limit are added only to the items query, not the total query, as they are not relevant for the total count
				if (typeof sort === 'string') {
					sort = sort.trim().toLowerCase();

					if (sort === 'published') {
						sort = 'published_date';
					}
					else if (sort === 'translated') {
						sort = 'translated_date';
					}
					else {
						sort = 'relevance';
					}

					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'sort_col', value: sort.trim(), type: 'text' });
				}
				if (typeof order === 'string') {
					order = order.trim().toLowerCase();

					if (order === 'asc') {
						order = 'ASC';
					}
					else {
						order = 'DESC';
					}

					addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: 'sort_dir', value: order.trim(), type: 'text' });
				}

				addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: '_offset', value: normalizedOffset, type: 'integer' });
				addQueryClause({ clauses: getQueryClauses, params: getQueryParams, columnName: '_limit', value: normalizedLimit, type: 'integer' });

				const getQuery = getQueryClauses.join(', ');
				const getTotalQuery = getTotalQueryClauses.join(', ');

				// Get the items and total count from the database using parameterized queries to prevent SQL injection
				const items = await db.query(`SELECT * FROM syndication.search_content_es(${getQuery})`, getQueryParams);

				const totalSql = getTotalQuery.length
					? `SELECT * FROM syndication.search_content_total_es(${getTotalQuery})`
					: 'SELECT * FROM syndication.search_content_total_es()';

				const [{ search_content_total_es }] = await db.query(totalSql, getTotalQueryParams);
				const total = parseInt(search_content_total_es, 10);

				items.forEach(item => {
					enrich(item);

					item.lang = lang;
				});

				const contentItemsMap = await getContent(items.map(({ content_id }) => content_id), true);

				const existing = await getAllExistingItemsForContract(contract.contract_id);

				const response = items.map(item => syndicate({
					contract,
					existing: existing[item.content_id],
					includeBody: false,
					item,
					src: contentItemsMap[item.content_id]
				}));

				res.json({ items: response, total });

				res.status(200);

				next();

				return;
			}
	}

	res.sendStatus(403);
};
