'use strict';

module.exports = exports = contentBuilder => {
	if (!('title' in contentBuilder)) {
		const { content, content_es, lang } = contentBuilder;

		contentBuilder.title = lang === 'es' ? content_es.title : content.title;
	}

	return contentBuilder.title;
};
