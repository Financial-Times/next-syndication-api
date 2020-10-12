'use strict';

module.exports = exports = (contentBuilder) => {

    if (!('previewText' in contentBuilder)) {

        const bodyText = contentBuilder.getProperty('bodyText');

        contentBuilder.previewText = bodyText.length <= 105 ? bodyText : (bodyText.substring(0, 105) + '...');  
    }
    
    return contentBuilder.previewText

};