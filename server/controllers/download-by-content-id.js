'use strict';

const esClient = require('@financial-times/n-es-client');

const log = require('../lib/logger');

const ContentBuilder = require('../lib/builders/content-builder');

const download = require('../lib/download');
const pg = require('../../db/pg');
const isDownloadDisabled = require('../helpers/is-download-disabled');

const {
	DEFAULT_DOWNLOAD_FORMAT,
	DEFAULT_DOWNLOAD_LANGUAGE,
	DOWNLOAD_ARTICLE_EXTENSION_OVERRIDES,
} = require('config');

module.exports = exports = async (req, res, next) => {
	const { contract, licence, user } = res.locals;

	const { download_format } = user;

	const format =
		req.query.format || download_format || DEFAULT_DOWNLOAD_FORMAT;

	const referrer = String(req.get('referrer'));

	const lang = String(
		req.query.lang ||
			(referrer.includes('/republishing/spanish')
				? 'es'
				: DEFAULT_DOWNLOAD_LANGUAGE)
	).toLowerCase();

	const contentId = req.params.content_id;

	try {
		const content_en = await esClient.get(contentId);

		const contentBuilder = new ContentBuilder(content_en).setDownloadFormat(
			format
		);

		if (lang === 'es') {
			const db = await pg();

			const [content_es] = await db.syndication.get_content_es_by_id([
				contentId,
			]);

			contentBuilder.setSpanishContent(content_es);
		}

		const content = contentBuilder.getContent([
			// article /  video / podcasts
			'id',
			'content_id',
			'type',
			'content_type',
			'url',
			'webUrl',
			'extension',
			'lang',
			'byline',
			'title',
			'bodyHTML',
			'bodyHTML__CLEAN',
			'bodyHTML__PLAIN',
			'hasGraphics',
			'canAllGraphicsBeSyndicated',
			'canBeSyndicated',
			'wordCount',
			'fileName',
			'publishedDate',
			'firstPublishedDate',

			// video / podcasts
			'hasTranscript',
			'transcriptExtension',
			'download',
			'captions',
		]);

		if (isDownloadDisabled(content, contract)) {
			res.sendStatus(403);
			return;
		}

		const dl = download({
			content,
			contract: contract,
			lang,
			licence: licence,
			req,
			user: user,
		});

		res.locals.content = content;
		res.locals.download = dl;

		req.on('abort', () => dl.cancel());
		req.connection.on('close', () => dl.cancel());

		const extension =
			DOWNLOAD_ARTICLE_EXTENSION_OVERRIDES[content.extension] ||
			content.extension;
		res.attachment(`${content.fileName}.${extension}`);

		if (dl.downloadAsArchive) {
			dl.on('error', (err, httpStatus) => {
				log.error({
					event: 'DOWNLOAD_ARCHIVE_ERROR',
					error: err.stack || err,
				});

				res.status(httpStatus || 500).end();
			});

			dl.on('end', () => {
				log.debug(
					`DownloadArchiveEnd => ${content.id} in ${Date.now() -
						dl.START}ms`
				);

				if (dl.cancelled !== true) {
					res.end();

					next();
				}
			});

			dl.on('complete', (state, status) => {
				res.status(status);
			});

			dl.on('cancelled', () => {
				next();
			});

			dl.pipe(res);

			await dl.appendAll();
		} else {
			const file = await dl.convertArticle();

			res.set('content-length', file.length);

			res.status(200).send(file);

			dl.complete('complete');

			next();
		}
	} catch (err) {
		res.sendStatus(404);
	}
};
