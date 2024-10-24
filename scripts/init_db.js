'use strict';


const { Logger } = require('../server/lib/logger');

const { db } = require('../db/connect');

const Contracts = require('../db/tables/contracts');
const History = require('../db/tables/history');
const path = require('path');
const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({source: MODULE_ID});
(async () => {
	const { TableNames } = await db.listTablesAsync();

	let createContracts = true;
	let createHistory = true;

	if (Array.isArray(TableNames)) {
		if (TableNames.includes(Contracts.TableName)) {
			createContracts = false;
		}
		if (TableNames.includes(History.TableName)) {
			createHistory = false;
		}
	}

	if (createContracts) {
		let contractsTable = await db.createTableAsync(Contracts);

		log.debug('CREATE_TABLE => ', contractsTable);
	}
	else {
		log.debug('TABLE_EXISTS => ', Contracts);
	}

	if (createHistory) {
		let historyTable = await db.createTableAsync(History);

		log.debug('CREATE_TABLE => ', historyTable);
	}
	else {
		log.debug('TABLE_EXISTS => ', History);
	}
})();
