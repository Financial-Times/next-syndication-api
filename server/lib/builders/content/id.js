'use strict';

module.exports = exports = (contentBuilder) => {

    if (!('id' in contentBuilder)){
        const { content, content_es, content_history } = contentBuilder;
        contentBuilder.id = content.id || content_es.content_id || content_history.content_id;
    }
    
    return contentBuilder.id

};
