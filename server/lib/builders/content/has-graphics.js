'use strict';

module.exports = exports = contentBuilder => {
	if (!('hasGraphics' in contentBuilder)) {
		const { content } = contentBuilder;

		contentBuilder.hasGraphics = Boolean(
			content.contentStats && content.contentStats.graphics
		);
	}

	return contentBuilder.hasGraphics;
};
