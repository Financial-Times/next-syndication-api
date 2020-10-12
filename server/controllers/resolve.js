'use strict';

const log = require('../lib/logger');

const getContent = require('../lib/get-content');
const getAllExistingItemsForContract = require('../lib/get-all-existing-items-for-contract');
const ContentBuilder = require('../lib/builders/content-builder');

module.exports = exports = async (req, res, next) => {
	const { body: contentIds } = req;

	const {
		locals: { contract },
	} = res;

	if (!Array.isArray(contentIds)) {
		log.warn({
			message: `Expected \`req.body\` to be [object Array] and got \`${Object.prototype.toString.call(
				contentIds
			)}\` instead`,
			referer: req.headers.referer,
		});

		return res.sendStatus(400);
	}

	if (!contentIds.length) {
		log.error({
			message: '`req.body` does not contain any content IDs',
			referer: req.headers.referer,
		});

		return res.sendStatus(400);
	}

	const DISTINCT_ITEMS = [...new Set(contentIds)];

	let items = await getContent(DISTINCT_ITEMS);

	const existing = await getAllExistingItemsForContract(contract.contract_id);

	const response = items.filter(filterContentType).map(item =>
		new ContentBuilder(item)
			.setContentHistory(existing[item.id])
			.setUserContract(contract)
			.getContent([
				'id',
				'type',
				'title',
				'wordCount',
				'lang',
				'canDownload',
				'canBeSyndicated',
				'downloaded',
				'saved',
				'embargoPeriod',
				'publishedDate',
				'publishedDateDisplay',
				'messageCode',
				'hasGraphics',
				'canAllGraphicsBeSyndicated'
			])
	);

	res.json(response);

	next();
};

function filterContentType(item) {
	let { type } = item;

	// TODO: revisit if it's still needed
	type = type
		.split('/')
		.pop()
		.toLowerCase();

	if (
		type === 'article' ||
		type === 'package' ||
		type === 'mediaresource' ||
		type === 'video' ||
		type === 'podcast'
	) {
		return true;
	}

	return false;
}
