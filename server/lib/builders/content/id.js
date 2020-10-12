'use strict';

module.exports = exports = contentBuilder => {
	if (!('id' in contentBuilder)) {
		const { content, content_es, content_history, lang } = contentBuilder;

		if(content){
			contentBuilder.id = content.id;
		} else if(lang === 'es' && content_es){
			contentBuilder.id = content_es.content_id;
		} else if(content_history){
			contentBuilder.id = content_history.content_id;
		}
	}

	return contentBuilder.id;
};
