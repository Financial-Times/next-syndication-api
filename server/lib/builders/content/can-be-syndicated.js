'use strict';

module.exports = exports = (contentBuilder) => {

    if (!('canBeSyndicated' in contentBuilder)) {

        const { content, content_es, contract, lang } = contentBuilder;
        const type = contentBuilder.getProperty('type');

        if (type === 'podcast') {

            if (canBeSyndicated === null || typeof canBeSyndicated === 'undefined'){
                content.canBeSyndicated = 'yes'
            }

            if (contract && contract.itemsMap) {
                const asset = contract.itemsMap[type];
    
                if (asset && asset.download_limit > 0) {
                    content.canBeSyndicated = 'yes';
                }
            }
        }

        if(lang === 'es'){

            content.canBeSyndicated = 'verify';

            if(contract){

                const content_area = content_es.content_area
                                    || content_es.content_area.toLowerCase();
        
                if ((content_area === 'spanish content' && contract.allowed.spanish_content)
                || (content_area === 'spanish weekend' && contract.allowed.spanish_weekend)) {
                    
                    content.canBeSyndicated = 'yes';
                    
                }
            }

        }
    
        contentBuilder.canBeSyndicated = content.canBeSyndicated;

    }
    
    return contentBuilder.canBeSyndicated;

};
