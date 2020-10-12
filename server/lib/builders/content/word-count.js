'use strict';

module.exports = exports = (contentBuilder) => {

    if (!('wordCount' in contentBuilder)) {

        const { content, content_es, lang } = contentBuilder;

        if (lang == 'en' && content.contentStats){
            contentBuilder.wordCount = content.contentStats.wordCount;
        } else if (lang == 'es' && content_es && content_es.word_count){
            contentBuilder.wordCount = content_es.word_count;
        } else {
            const bodyText = contentBuilder.getProperty('bodyText');
            contentBuilder.wordCount = bodyText.length;
        }
    }
    
    return contentBuilder.wordCount

};