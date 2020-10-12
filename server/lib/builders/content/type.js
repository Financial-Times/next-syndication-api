'use strict';

const { CONTENT_TYPE_ALIAS } = require('config');

const path = require('path');
const url = require('url');

module.exports = exports = contentBuilder => {
	if (!('type' in contentBuilder)) {
		const { content, content_es, content_history } = contentBuilder;

		let type =
			content.type ||
			content_es.content_type ||
			content_history.content_type;

		if (type.startsWith('http')) {
			type = String(path.basename(url.parse(type).pathname)).toLowerCase();
		}

		contentBuilder.type = CONTENT_TYPE_ALIAS[type] || type;
	}

	return contentBuilder.type;
};
