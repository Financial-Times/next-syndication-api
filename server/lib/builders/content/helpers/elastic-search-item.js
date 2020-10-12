'use strict';

module.exports = exports = (contentBuilder, key) => {

    if(!key){
        return undefined;
    }

    const { content } = contentBuilder;

    if (!(key in contentBuilder) && content && key in content) {
        contentBuilder[key] = content[key]
    }
    
    return contentBuilder[key] || undefined;

};
