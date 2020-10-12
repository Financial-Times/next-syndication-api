'use strict';

const moment = require('moment');

const {
	MESSAGES: { DATE_FORMAT },
} = require('config');

module.exports = exports = contentBuilder => {
	const { content_es } = contentBuilder;

	if (!('translatedDateDisplay' in contentBuilder) && content_es) {
		contentBuilder.translatedDateDisplay = moment(
			content_es.translated_date
		).format(DATE_FORMAT);
	}

	return contentBuilder.translatedDateDisplay || undefined;
};
