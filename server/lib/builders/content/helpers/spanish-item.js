'use strict';

module.exports = exports = (contentBuilder, key) => {
	if (!key) {
		return undefined;
	}

	const { content_es } = contentBuilder;

	if (!(key in contentBuilder) && content_es && key in content_es) {
		contentBuilder[key] = content_es[key];
	}

	return contentBuilder[key] || undefined;
};
