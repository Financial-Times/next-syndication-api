'use strict';

module.exports = exports = contentBuilder => {
	if (!('downloaded' in contentBuilder)) {
		const { content_history, content_state } = contentBuilder;

		if (content_state) {
			contentBuilder.downloaded = content_state.downloaded;
		} else if (content_history) {
			contentBuilder.downloaded = content_history.downloaded;
		}
	}

	return contentBuilder.downloaded || undefined;
};
