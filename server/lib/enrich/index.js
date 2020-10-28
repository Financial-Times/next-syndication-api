'use strict';

const log = require('../logger');

module.exports = exports = function enrich(content, contract, graphicSyndicationFlag) {
	if (!content.type && content.content_type) {
		content.type = content.content_type;
	}

	if (Object.prototype.toString.call(content) === '[object Object]' && !(content instanceof Error) && content.type in exports) {
		const START = Date.now();

		content = exports[content.type](content, contract, graphicSyndicationFlag);

		log.debug(`Enrich ${content.type} in ${Date.now() - START}ms`);

		return content;
	}

	return null;
};

exports.article = require('./article');
exports.podcast = require('./podcast');
exports.video = require('./video');
exports.package = require('./package');
