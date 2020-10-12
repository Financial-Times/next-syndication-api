'use strict';

const {
	DOWNLOAD_ARTICLE_FORMATS,
	DOWNLOAD_ARCHIVE_EXTENSION,
} = require('config');

module.exports = exports = (contentBuilder, key = 'extension') => {
	if (!(key in contentBuilder)) {
		const { format } = contentBuilder;

		const type = contentBuilder.getProperty('type');

		const documentExtension = DOWNLOAD_ARTICLE_FORMATS[format] || 'docx';

		if (type === 'video' || type === 'podcast') {
			contentBuilder.extension = DOWNLOAD_ARCHIVE_EXTENSION;
			contentBuilder.transcriptExtension = documentExtension;
		} else {
			contentBuilder.extension = documentExtension;
		}
	}

	return key in contentBuilder ? contentBuilder[key] : undefined;
};
