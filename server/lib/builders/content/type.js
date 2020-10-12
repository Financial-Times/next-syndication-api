'use strict';

const { CONTENT_TYPE_ALIAS } = require('config');

const path = require('path');
const url = require('url');

module.exports = exports = contentBuilder => {
	if (!('type' in contentBuilder)) {
		const { content, content_es, content_history, lang } = contentBuilder;

		if(content){
			contentBuilder.type = content.type;
		} else if(lang === 'es' && content_es) {
			contentBuilder.type = content_es.content_type;
		} else if(content_history){
			contentBuilder.type = content_history.content_type;
		}

		if (contentBuilder.type.startsWith('http')) {
			contentBuilder.type = String(path.basename(url.parse(contentBuilder.type).pathname)).toLowerCase();
		}
		if (contentBuilder.type){
			contentBuilder.type = CONTENT_TYPE_ALIAS[contentBuilder.type] || contentBuilder.type;
		}
	}

	return contentBuilder.type;
};
