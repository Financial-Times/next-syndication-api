'use strict';

const path = require('path');

const { Logger } = require('../../server/lib/logger');

exports.backup = require('./backup');
exports.redshift = require('./redshift');
exports.tidyBucket = require('./tidy-bucket');

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({source: MODULE_ID});

process.on('unhandledRejection', (reason, promise) => {
	log.warn(`${MODULE_ID} | UnhandledRejection =>`, {
		error: reason.stack || reason,
		promise
	});
});
