'use strict';

module.exports = exports = (contentBuilder) => {

    if (!('bodyText' in contentBuilder)) {

        const { content, content_es, lang } = contentBuilder;

        if(lang == 'en' && 'bodyText' in content ){
            contentBuilder.bodyText = content.bodyText.trim();
        } else if ( lang == 'es' && 'body' in content_es){
            contentBuilder.bodyText = content_es.body.replace(/<(.|\n)*?>/g, '').trim() 
        } 

        contentBuilder.bodyText = contentBuilder.bodyText || '';
    }
    
    return contentBuilder.bodyText

};