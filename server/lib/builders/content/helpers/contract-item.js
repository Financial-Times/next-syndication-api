'use strict';

module.exports = exports = (contentBuilder, key) => {
	if (!key) {
		return undefined;
	}

	const { contract } = contentBuilder;

	if (!(key in contentBuilder) && contract && key in contract) {
		contentBuilder[key] = contract[key];
	}

	return contentBuilder[key] || undefined;
};
