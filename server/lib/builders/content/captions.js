'use strict';

const { DOWNLOAD_MEDIA_TYPES } = require('config');

module.exports = exports = contentBuilder => {
	if (!('captions' in contentBuilder)) {
		const { content } = contentBuilder;

		const type = contentBuilder.getProperty('type');

		if (type === 'podcast') {
			contentBuilder.captions = content.attachments.filter(
				item => item.mediaType === DOWNLOAD_MEDIA_TYPES.caption
			);
		}
	}

	return contentBuilder.captions || undefined;
};
