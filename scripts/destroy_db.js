'use strict';

const path = require('path');

const { Logger } = require('../server/lib/logger');

const { db } = require('../db/connect');

const Contracts = require('../db/tables/contracts');
const History = require('../db/tables/history');

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({source: MODULE_ID});

(async () => {
	try {
		let res = await db.deleteTableAsync({ TableName: Contracts.TableName });

		log.debug(`| ${Contracts.TableName} => `, { res: JSON.stringify(res, null, 4) });
	}
	catch (e) {
		log.error(`${MODULE_ID} | ${Contracts.TableName} => `, { error: e.stack });
	}

	try {
		let res = await db.deleteTableAsync({ TableName: History.TableName });

		log.debug(`| ${History.TableName} => `, { res: JSON.stringify(res, null, 4) });
	}
	catch (e) {
		log.error(`${MODULE_ID} | ${History.TableName} => `, { error: e.stack });
	}
})();
