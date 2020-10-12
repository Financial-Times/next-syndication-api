'use strict';

const log = require('../lib/logger');

const getContent = require('../lib/get-content');
const getHistoryByContractID = require('../lib/get-history-by-contract-id');
const ContentBuilder = require('../lib/builders/content-builder');

module.exports = exports = async (req, res, next) => {
	const START = Date.now();

	try {
		const CONTRACT = res.locals.contract;

		const options = {
			contract_id: CONTRACT.contract_id,
		};

		if (req.query.show === 'mine') {
			options.user_id = res.locals.userUuid;
		}

		if (req.query.type) {
			options.type = req.query.type;
		}

		if (req.query.offset) {
			const offset = parseInt(req.query.offset, 10);

			if (typeof offset === 'number' && offset === offset) {
				options.offset = offset;
			}
		}

		if (req.query.limit) {
			const limit = parseInt(req.query.limit, 10);

			if (typeof limit === 'number' && limit === limit) {
				options.limit = limit;
			}
		}

		let history = await getHistoryByContractID(options);

		const contentItemsMap = await getContent(
			history.items.map(({ id }) => id),
			true
		);

		history.items = history.items.map(item =>
			new ContentBuilder(contentItemsMap[item.content_id])
				.setContentHistory(item)
				.setUserContract(CONTRACT)
				.getContent([
					'id',
					'content_id',
					'contract_id',
					'user_id',
					'user_name',
					'user_email',
					'asset_type',
					'type',
					'content_type',
					'content_url',
					'time',
					'state',
					'title',
					'published_date',
					'syndication_state',
					'last_modified',
					'lang',
					'iso_lang_code',
					'downloaded',
					'saved',
					'date',
					'published',
					'canDownload',
					'canBeSyndicated',
					'embargoPeriod',
					'publishedDate',
					'publishedDateDisplay',
					'wordCount',
					'translatedDateDisplay',
					'messageCode',
				])
		);

		log.debug(
			`Retrieved ${history.items.length} items in ${Date.now() - START}ms`
		);

		if (Array.isArray(history.items)) {
			res.status(200);

			res.json(history);
		} else {
			res.sendStatus(400);
		}

		next();
	} catch (error) {
		log.error({
			event: 'HISTORY_ERROR',
			error,
		});

		res.sendStatus(400);
	}
};
