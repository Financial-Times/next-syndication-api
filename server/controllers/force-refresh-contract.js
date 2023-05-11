'use strict';

const { Logger } = require('../lib/logger');

const {
	SALESFORCE: {
		ENVIRONMENT: SALESFORCE_ENVIRONMENT
	}
} = require('config');

const contractsColumnMappings = require('../../db/pg/column_mappings/contracts');
const pgMapColumns = require('../../db/pg/map-columns');
const pg = require('../../db/pg');

const getSalesforceContractByID = require('../lib/get-salesforce-contract-by-id');
const reformatSalesforceContract = require('../lib/reformat-salesforce-contract');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'controllers/force-refresh-contract'});
	try {
		if (SALESFORCE_ENVIRONMENT !== 'production') {
			res.json({
				error: 'IncorrectSalesforceEnvironmentError'
			});

			res.status(400);

			next();

			return;
		}

		let contract = await getSalesforceContractByID(req.params.contract_id);

		if (contract.success === true) {
			const updateTime =  new Date();
			
			let contract_data = reformatSalesforceContract(JSON.parse(JSON.stringify(contract)));
			contract_data.last_updated = updateTime;
			contract_data = pgMapColumns(contract_data, contractsColumnMappings);
			
			try {
				const db = await pg();
				await db.syndication.upsert_contract([contract_data]);
			}
			catch (error) {
				res.status(400);
				res.json({
					event: 'FORCE_REFRESH_CONTRACT_DB_CONNECTION_ERROR',
					error: 'Updating the contract in the Syndication Database failed'
				})
			}
			
			res.status(201);
			contract.last_updated = updateTime;
			contract = reformatSalesforceContract(contract);

			res.json(contract);

			next();
		}
		else {
			res.status(400);
			res.json({
				event: 'FORCE_REFRESH_CONTRACT_ERROR',
				error: contract.errorMessage
			});
		}
	}
	catch (error) {
		log.error('FORCE_REFRESH_CONTRACT_ERROR', {
			route: req.route.path,
			error
		});

		res.sendStatus(500);
	}
};
