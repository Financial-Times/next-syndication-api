'use strict';

module.exports = exports = (content) => {
	if (content.lang === 'en') {

		// content.contentStats.wordCount is returned by elasticsearch for articles
		if (content.contentStats && content.contentStats.wordCount){
			return content.contentStats.wordCount;
		}

		// videos and podcast don't have contentStats
		return content.bodyText.trim().split(' ').length

	} else if (content.lang === 'es') {

		if(content_es.word_count){
			return content_es.word_count;
		}
		
		return content.bodyHTML.replace(/<(.|\n)*?>/g, '').trim().split(' ').length;
	} 
	
	return 0;
};