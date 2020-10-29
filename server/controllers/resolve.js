'use strict';

const { Logger } = require('../lib/logger');

const flagIsOn = require('../helpers/flag-is-on');

const getContent = require('../lib/get-content');
const getAllExistingItemsForContract = require('../lib/get-all-existing-items-for-contract');
const syndicate = require('../lib/syndicate-content');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'controllers/resolve'});

	const { body } = req;

	const { locals: { contract, flags } } = res;

	if (!Array.isArray(body)) {
		log.warn('RESOLVE_INVALID_REQUEST_BODY', {
			message: `Expected \`req.body\` to be [object Array] and got \`${Object.prototype.toString.call(body)}\` instead`,
			referer: req.headers.referer
		});

		return res.sendStatus(400);
	}

	if (!body.length) {
		log.error('RESOLVE_BODY_NO_CONTENT_ID', {
			message: '`req.body` does not contain any content IDs',
			referer: req.headers.referer
		});

		return res.sendStatus(400);
	}

	const DISTINCT_ITEMS = Object.keys(body.reduce((acc, id) => {
		acc[id] = id;

		return acc;
	}, {}));

	let items = await getContent(DISTINCT_ITEMS);

	items = items.filter(item => showItem(item, flags));

	const existing = await getAllExistingItemsForContract(contract.contract_id);

	const response = items.map(src => syndicate({
		contract,
		existing: existing[src.id],
		includeBody: false,
		item: {},
		src
	}));

	res.json(response);

	next();
};

function showItem(item, flags) {
	let { type } = item;

	// TODO: revisit if it's still needed
	type = type.split('/').pop().toLowerCase();

	if (type === 'article' || type === 'package') {
		return true;
	}

	if (type === 'mediaresource' || type === 'video' || type === 'podcast') {
		return true;
	}

	if (type === 'placeholder') {
		return flagIsOn(flags.syndicationDownloadPlaceholder);
	}
}
