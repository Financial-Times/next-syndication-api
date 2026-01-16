'use strict';

const { Logger } = require('../lib/logger');

const getContentById = require('../lib/get-content-by-id');
const prepareDownloadResponse = require('../lib/prepare-download-response');

const download = require('../lib/download');
const isDownloadDisabled = require('../helpers/is-download-disabled');

const {
	DEFAULT_DOWNLOAD_FORMAT,
	DEFAULT_DOWNLOAD_LANGUAGE,
} = require('config');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({
		req,
		res,
		source: 'controllers/download-by-content-id',
	});
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

	const content = await getContentById(
		req.params.content_id,
		format,
		lang,
		contract
	);

	if (Object.prototype.toString.call(content) !== '[object Object]') {
		res.sendStatus(404);
		return;
	}

	if (isDownloadDisabled(content, contract)) {
		log.error('DOWNLOAD_DISABLED_ERROR', contract);
		res.sendStatus(403);
		return;
	}

	const dl = download({
		content,
		contract,
		lang,
		licence,
		req,
		user,
	});

	res.locals.content = content;
	res.locals.download = dl;

	req.on('abort', () => dl.cancel());
	req.connection.on('close', () => dl.cancel());

	prepareDownloadResponse(res, content);

	let articleOrArchive = dl.downloadAsArchive ? 'Archive' : 'Article';

	log.count(`${articleOrArchive.toLowerCase()}-download-start`);

	dl.on('error', (err) => {
		log.error(`DOWNLOAD_${articleOrArchive.toUpperCase()}_ERROR`, {
			event: `DOWNLOAD_${articleOrArchive.toUpperCase()}_ERROR`,
			error: err.stack || err,
		});
		log.count(`${articleOrArchive.toLowerCase()}-download-error`);
		res.status(500).end();
	});

	dl.on('complete', (state, status) => {
		if (state === 'complete') {
			log.count(`${articleOrArchive.toLowerCase()}-download-complete`);
		}
		res.status(status);
	});

	dl.on('cancelled', () => {
		next();
	});

	if (articleOrArchive === 'Archive') {
		dl.on('end', () => {
			log.debug(
				`DownloadArchiveEnd => ${content.id} in ${
					Date.now() - dl.START
				}ms`
			);

			if (dl.cancelled !== true) {
				res.end();
				next();
			}
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
};
