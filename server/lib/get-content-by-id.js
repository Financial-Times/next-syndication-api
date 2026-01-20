'use strict';

const esClient = require('@financial-times/n-es-client');

const { DOWNLOAD_ARTICLE_FORMATS } = require('config');

const { Logger } = require('./logger');
const log = new Logger({ source: 'lib/get-content-by-id' });

const pg = require('../../db/pg');

const enrich = require('./enrich');

module.exports = exports = async (contentId, format, lang, contract) => {
	let content;

	try {
		if (lang === 'es') {
			const db = await pg();

			[content] = await db.syndication.get_content_es_by_id([contentId]);

			const contentEN = await esClient.get(contentId);

			[
				'id',
				'canBeSyndicated',
				'firstPublishedDate',
				'publishedDate',
				'url',
				'webUrl',
			].forEach((prop) => (content[prop] = contentEN[prop]));

			content.lang = lang;
		} else {
			content = await esClient.get(contentId);
		}

		content.extension = DOWNLOAD_ARTICLE_FORMATS[format] || 'docx';
	} catch (error) {
		log.error('GET_CONTENT_FAILED', {
			event: 'GET_CONTENT_FAILED',
			contentId,
			lang,
			error,
		});
		content = null;
	}

	if (content) {
		try {
			content = enrich(content, contract);

			log.info('GET_CONTENT_SUCCESS', {
				event: 'GET_CONTENT_SUCCESS',
				contentId,
			});
		} catch (error) {
			log.error('ENRICHING_CONTENT_FAILED', {
				event: 'ENRICHING_CONTENT_FAILED',
				contentId,
				error,
			});

			content = null;
		}
	}

	return content;
};
