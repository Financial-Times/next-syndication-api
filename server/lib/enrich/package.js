'use strict';

const article = require('./article');

module.exports = exports = function package_(content, contract, graphicSyndicationFlag) {
	content = article(content, contract, graphicSyndicationFlag);

	return content;
};
