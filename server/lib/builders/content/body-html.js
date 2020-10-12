'use strict';

const formatArticleXML = require('../../format-article-xml');
const decorateArticle = require('../../decorate-article');
const toPlainText = require('../../to-plain-text');


module.exports = exports = (contentBuilder, key = 'bodyHTML') => {

    if (!(key in contentBuilder)) {

        const { content, content_es, lang } = contentBuilder;

        const bodyHTML = lang === 'es'? content_es.body : content.bodyHTML;
    
        if(bodyHTML){

            const contentDocument = formatArticleXML(`<body>${bodyHTML}</body>`);
                
    
            const decoratedDocument = decorateArticle(contentDocument, 
                contentBuilder.getContent([
                    'extension',
                    'wordCount',
                    'byline',
                    'lang',
                    'publishedDate',
                    'title',
                    'url',
                    'webUrl',
                    'translated_date',
                    'content_id'
                ]));
    
            contentBuilder.body = bodyHTML;
            contentBuilder.bodyHTML = bodyHTML;

            contentBuilder.bodyHTML__CLEAN = decoratedDocument.toString();
    
            // we need to strip all formatting — leaving only paragraphs — and pass this to pandoc for plain text
            // otherwise it will uppercase the whole article title and anything bold, as well as leave other weird
            // formatting in the text file
            contentBuilder.bodyHTML__PLAIN = toPlainText(decoratedDocument.toString());

        }
    }
    
    return contentBuilder[key];

};
