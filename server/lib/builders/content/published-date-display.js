'use strict';

const moment = require('moment');

const {
	MESSAGES: { DATE_FORMAT },
} = require('config');

module.exports = exports = contentBuilder => {
	const { content } = contentBuilder;

	if (!('publishedDateDisplay' in contentBuilder) && content) {

		contentBuilder.publishedDateDisplay = moment(
			content.firstPublishedDate || content.publishedDate
		).format(DATE_FORMAT);
	}

	return contentBuilder.publishedDateDisplay;
};
