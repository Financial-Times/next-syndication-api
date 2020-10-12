'use strict';

module.exports = exports = contentBuilder => {
	if (!('saved' in contentBuilder)) {
		const { content_history, content_state } = contentBuilder;

		if (content_state) {
			contentBuilder.saved = content_state.saved;
		} else if (content_history) {
			contentBuilder.saved = content_history.saved;
		}
	}

	return contentBuilder.saved || undefined;
};
