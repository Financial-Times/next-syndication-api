'use strict';

const log = require('@financial-times/n-logger').default;
const fetch = require('n-eager-fetch');

const { apikey: API_KEY, BASE_URI_FT_API, TIMEOUT_ARTICLE_FETCH }= require('config');

module.exports = exports = content_id => {
    const ARTICLE_URI = `${BASE_URI_FT_API}/content/${content_id}`;

    log.debug(`ATTEMPTING TO RETRIEVE ARTICLE: ${ARTICLE_URI}`);

    return fetch(ARTICLE_URI, {
            timeout: TIMEOUT_ARTICLE_FETCH,
            headers: {
                'X-Api-Key': API_KEY
            }
        })
        .then(res => {
            if (res.status === 200) {
                log.info(`SUCCESSFULLY RETRIEVED ARTICLE: ${ARTICLE_URI}`, res);

                return res.json();
            }

            if (res.status > 399) {
                log.error(`RETRIEVE ARTICLE ERROR: ${ARTICLE_URI}`, res);
            }
            else {
                log.warn(`RETRIEVE ARTICLE WARNING: ${ARTICLE_URI}`, res);
            }

            return res.text();
        })
        .catch(err => {
            log.error(`ERROR TRYING TO RETRIEVE ARTICLE: ${ARTICLE_URI}`, err.stack);

            throw err;
        });
};

