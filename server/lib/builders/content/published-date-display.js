'use strict';

const moment = require('moment');

const {
	MESSAGES: { DATE_FORMAT }
} = require('config');

module.exports = exports = (contentBuilder) => {

    if (!('publishedDateDisplay' in contentBuilder)) {

        const { content } = contentBuilder;

        contentBuilder.publishedDateDisplay = moment(content.firstPublishedDate || content.publishedDate).format(DATE_FORMAT);

    }
    
    return contentBuilder.publishedDateDisplay;

};