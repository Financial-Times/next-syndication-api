'use strict';

module.exports = exports = (contentBuilder) => {

    if (!('download' in contentBuilder)) {

        const { content } = contentBuilder;

        const type = contentBuilder.getProperty('type');

        if (type === 'video' || type === 'podcast') {
            const download = Array.from(content.attachments).reverse().find(item => item.mediaType === DOWNLOAD_MEDIA_TYPES[type]);

            Object.assign(download, {
                extension: mime.extension(download.mediaType)
            });

            contentBuilder.download = download;
        }

    }
    
    return contentBuilder.download || undefined;

};

