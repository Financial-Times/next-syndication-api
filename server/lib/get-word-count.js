'use strict';

module.exports = exports = (content) => {
	if (content.lang === 'en') {

		// content.contentStats.wordCount is returned by elasticsearch for articles
		if (content.contentStats && content.contentStats.wordCount){
			return content.contentStats.wordCount;
		}

		// videos and podcast don't have contentStats
		if (content.bodyText){
			return content.bodyText.replace((/  |\r\n|\n|\r/gm),'').trim().split(/\s+/).length
		}

	} else if (content.lang === 'es') {

		if(content.word_count){
			return content.word_count;
		}

	}

	return content.bodyHTML.replace(/<(.|\n)*?>/g, '').trim().split(/\s+/).length;
};
