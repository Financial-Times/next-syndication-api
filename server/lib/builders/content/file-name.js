'use strict';

const {
	DOWNLOAD_FILENAME_PREFIX,
} = require('config');

const RE_BAD_CHARS = /[^A-Za-z0-9_]/gm;
const RE_SPACE = /\s/gm;

module.exports = exports = (contentBuilder) => {

    if (!('fileName' in contentBuilder)) {

        const title = contentBuilder.getProperty('title');

        contentBuilder.fileName = DOWNLOAD_FILENAME_PREFIX + title.replace(RE_SPACE, '_').replace(RE_BAD_CHARS, '').substring(0, 12);
    }
    
    return contentBuilder.fileName;

};
