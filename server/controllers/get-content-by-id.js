'use strict';

const esClient = require('@financial-times/n-es-client');

const {
	DEFAULT_DOWNLOAD_FORMAT,
	DEFAULT_DOWNLOAD_LANGUAGE,
} = require('config');

const log = require('../lib/logger');
const ContentBuilder = require('../lib/builders/content-builder');

const pg = require('../../db/pg');

module.exports = exports = async (req, res, next) => {
	try {
		const {
			locals: { $DB: db, /*allowed,*/ contract, user },
		} = res;
		const { download_format } = user;

		const format =
			req.query.format || download_format || DEFAULT_DOWNLOAD_FORMAT;

		const lang = String(
			req.query.lang || DEFAULT_DOWNLOAD_LANGUAGE
		).toLowerCase();

		const contentId = req.params.content_id;

		const content_en = await esClient.get(contentId);

		const [
			{ get_content_state_for_contract: state },
		] = await db.syndication.get_content_state_for_contract([
			contract.contract_id,
			contentId,
		]);

		const contentBuilder = new ContentBuilder(content_en)
			.setDownloadFormat(format)
			.setUserContract(contract)
			.setContentState(state);

		if (lang === 'es') {
			const db = await pg();

			const [content_es] = await db.syndication.get_content_es_by_id([
				contentId,
			]);

			contentBuilder.setSpanishContent(content_es);
		}

		const content = contentBuilder.getContent([
			'id',
			'content_id',
			'type',
			'content_type',
			'content_area',
			'byline',
			'title',
			'body',
			'translated_date',
			'state',
			'last_modified',
			'word_count',
			'wordCount',
			'published_date',
			'publishedDate',
			'firstPublishedDate',
			'url',
			'webUrl',
			'lang',
			'extension',
			'bodyHTML',
			'bodyHTML__CLEAN',
			'bodyHTML__PLAIN',
			'previewText',
			'fileName',
			'canDownload',
			'canBeSyndicated',
			'saved',
			'downloaded',
			'embargoPeriod',
			'publishedDateDisplay',
			'translatedDate',
			'translatedDateDisplay',
			'messageCode',
		]);

		res.status(200);

		res.json(content);

		next();
	} catch (error) {
		log.error({
			event: 'FAILED_TO_GET_CONTENT_BY_ID',
			error,
		});

		res.sendStatus(404);
	}
};
