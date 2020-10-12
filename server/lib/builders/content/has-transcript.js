'use strict';

module.exports = exports = contentBuilder => {
	if (!('hasTranscript' in contentBuilder)) {
		const type = contentBuilder.getProperty('type');
		const bodyText = contentBuilder.getProperty('bodyText');

		if (type === 'video' || type === 'podcast') {
			contentBuilder.hasTranscript = Boolean(bodyText);
		}
	}

	return contentBuilder.hasTranscript || undefined;
};
