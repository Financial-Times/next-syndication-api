'use strict';

const { exec } = require('child_process');
const path = require('path');
const { PassThrough } = require('stream');
const util = require('util');
const url = require('url');

const { Logger } = require('../logger');
const log = new Logger({ source: 'lib/download/video' });
const fetch = require('n-eager-fetch');

const ArticleDownload = require('./article');

const execAsync = util.promisify(exec);

module.exports = exports = class VideoDownload extends ArticleDownload {
	get [Symbol.toStringTag]() {
		return 'VideoDownload';
	}

	get downloadAsArchive() {
		return true;
	}

	async appendAll() {
		await Promise.all([this.appendArticle(), this.appendCaptions(), this.appendMedia()]);
	}

	async appendArticle() {
		if (this.articleAppended === true) {
			return;
		}

		const { content } = this;

		if (content.hasTranscript === true) {
			const file = await this.convertArticle(content.transcriptExtension);

			this.append(file, { name: `${content.fileName}.${content.transcriptExtension}` });
		}

		this.articleAppended = true;

		if (this.shouldFinalize) {
			this.finalize();
		}
	}

	async appendCaptions() {
		if (this.captionsAppended === true) {
			return;
		}

		const { content } = this;
		const { captions } = content;

		if (Array.isArray(captions) && captions.length) {
			try {
				const captionFiles = await Promise.all(
					captions.map(async ({ url: uri }) => {
						const { stdout: file } = await execAsync(`curl ${uri}`);
						const name = path.basename(url.parse(uri).pathname);

						return { file, name };
					})
				);

				this.captionFiles = captionFiles;

				captionFiles.forEach(({ file, name }) => this.append(file, { name }));
			} catch (error) {
				log.error('appendCaptions', {
					error,
					contentId: content.id,
				});
			}
		}

		this.captionsAppended = true;

		if (this.shouldFinalize) {
			this.finalize();
		}
	}

	async appendMedia() {
		if (this.mediaAppended === true) {
			return;
		}

		const { content } = this;
		const { download, fileName } = content;

		const headers = this.cloneRequestHeaders();

		const headRes = await fetch(download.url, {
			method: 'HEAD',
			headers: headers,
		});

		if (!headRes.ok) {
			this.emit('error', await headRes.text(), headRes.status);
			return;
		}

		this.MEDIA_LENGTH = parseInt(headRes.headers.get('content-length'), 10);
		this.downloadedMediaLength = 0;

		this.createMediaStream();

		this.append(this.ptStream, { name: `${fileName}.${download.extension}` });

		const mediaRes = await fetch(download.url, { headers: headers });

		const reader = mediaRes.body.getReader();

		const read = async () => {
			const { done, value } = await reader.read();
			if (done) {
				this.ptStream.end();
			} else {
				this.ptStream.write(value);
				read();
			}
		};

		read();

		this.mediaStream = mediaRes.body;
	}

	cancel() {
		if (
			typeof this.finalState !== 'undefined' ||
			this.success === true ||
			this.cancelled === true ||
			this.endCalled === true
		) {
			return;
		}

		this.cancelled = true;

		if (this.endCalled !== true) {
			!this.mediaStream || this.mediaStream.cancel();
			this.mediaStream && this.mediaStream.cancel();

			this.end();

			this.onEnd();

			this.endCalled = true;

			this.emit('cancelled');
		}
	}

	cloneRequestHeaders() {
		const { req } = this;

		let headers = JSON.parse(JSON.stringify(req.headers));

		['accept', 'host'].forEach((name) => delete headers[name]);

		Object.keys(headers).forEach((name) => headers[name] !== '-' || delete headers[name]);

		return headers;
	}

	createMediaStream() {
		const stream = (this.ptStream = new PassThrough());

		stream.on('error', () => this.onEnd());
		stream.on('close', () => this.onEnd());
		stream.on('end', () => this.onEnd());

		stream.on('data', (chunk) => {
			if (this.cancelled === true) {
				if (this.endCalled !== true) {
					this.mediaStream.cancel();
					this.end();
					this.onEnd();
					this.endCalled = true;
				}

				return;
			}

			this.mediaAppended = true;

			if (this.shouldFinalize) {
				this.finalize();
			}

			this.downloadedMediaLength += chunk.length;
		});
	}

	onEnd() {
		if (this.endCalled !== true) {
			let state = 'complete';
			let status = 200;

			if (this.downloadedMediaLength < this.MEDIA_LENGTH || this.cancelled === true) {
				state = 'interrupted';
				status = 400;
			}

			this.complete(state, status);
		}
	}
};
