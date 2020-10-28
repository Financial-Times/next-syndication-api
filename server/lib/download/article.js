'use strict';

const path = require('path');

const log = require('../logger');

const { DOWNLOAD_ARCHIVE_EXTENSION } = require('config');

const Archiver = require('archiver/lib/core');
const ArchiveType = require(`archiver/lib/plugins/${DOWNLOAD_ARCHIVE_EXTENSION}`);

const DocumentBuilder = require('../builders/document-builder');
const convertArticle = require('../convert-article');

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = class ArticleDownload extends Archiver {
	constructor({ content, contract, event, licence, req, user }) {
		super(DOWNLOAD_ARCHIVE_EXTENSION);

		this.setFormat(DOWNLOAD_ARCHIVE_EXTENSION);

		this.setModule(new ArchiveType());

		this.content = content;
		this.contract = contract;
		this.event = event;
		this.licence = licence;
		this.req = req;
		this.user = user;

		this.init();
	}

	get [Symbol.toStringTag]() {
		return 'ArticleDownload';
	}

	get bundled() {
		if (this.downloadAsArchive === true) {
			return this.articleAppended === true
				&& this.captionsAppended === true
				&& this.mediaAppended === true;
		}

		return true;
	}

	get downloadAsArchive() {
		return false;
	}

	get shouldFinalize() {
		return this.bundled
			&& this._state.finalize !== true
			&& this._state.finalizing !== true;
	}

	cancel() {
		if (typeof this.finalState !== 'undefined' || this.success === true || this.cancelled === true || this.endCalled === true) {
			return;
		}

		this.cancelled = true;

		log.warn(`${MODULE_ID} => DownloadRequestCancelled => `, this.event.toJSON());

		if (this.endCalled !== true) {
			this.endCalled = true;
		}
	}

	complete(state, status) {
		if (typeof this.finalState !== 'undefined' || this.endEvent) {
			return;
		}

		this.finalState = state;
		this.httpStatus = status;

		const event = this.endEvent = this.event.clone({ state });

		process.nextTick(async () => await event.publish());

		this.emit('complete', state, status);
	}

	async convertArticle(format) {
		const { content } = this;

		if (!format) {
			format = content.extension;
		}

		try {
			if (format === 'xml') {
				this.file = new DocumentBuilder(content)
								.removeElementsByTagName() // Remove elements defined in FORMAT_ARTICLE_STRIP_ELEMENTS
								.removeElementsByTagName(['img', 'figure'])
								.removeProprietaryElement()
								.removeWhiteSpace()
								.getXMLFile();
			}
			else {
				this.file = await convertArticle({
					source: content[format === 'plain' ? 'bodyHTML__PLAIN' : 'bodyHTML__CLEAN'],
					sourceFormat: 'html',
					targetFormat: format
				});
			}

			return this.file;
		}
		catch (error) {
			log.error({
				contentId: content.id,
				error
			});
		}
	}

	init() {
		const { event } = this;

		this.START = Date.now();

		this.cancelled = false;
		this.articleAppended = false;
		this.captionsAppended = false;
		this.mediaAppended = false;

		process.nextTick(async () => await event.publish());
	}

	onEnd() {
		if (this.endCalled !== true) {
			let state = 'complete';
			let status = 200;

			if (this.success !== true) {
				state = 'interrupted';
				status = 400;
			}

			this.complete(state, status);
		}
	}
};
