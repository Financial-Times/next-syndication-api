'use strict';

const { FORMAT_ARTICLE_CONTENT_TYPE } = require('config');

module.exports = exports = class DocumentBuilder {
	constructor(contentBodyHTML) {
		this.contentBodyHTML = contentBodyHTML;
		this.contentDocument = new DOMParser().parseFromString(
			this.contentBodyHTML,
			FORMAT_ARTICLE_CONTENT_TYPE
		);
	}
};
