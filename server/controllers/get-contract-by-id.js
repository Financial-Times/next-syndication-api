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
	const log = new Logger({req, res, source: 'controllers/get-contract-by-id'});
	try {
		if (SALESFORCE_ENVIRONMENT !== 'production') {
			res.json({
				error: 'IncorrectSalesforceEnvironmentError'
			});

			res.status(400);

			next();

			return;
		}

		let sfContract = await getSalesforceContractByID(req.params.contract_id);

		if (sfContract.success === true) {
			res.status(200);
			let reformattedContract;
			if (req.query.save !== '0') {
				reformattedContract = reformatSalesforceContract(JSON.parse(JSON.stringify(sfContract)));
				reformattedContract.last_updated = new Date();
				if (sfContract?.orders) {
					const currentTimeInMilliseconds = new Date();
					const activeOrder = sfContract.orders.find(order => order?.status === 'Activated' && new Date(order?.startDate) <= currentTimeInMilliseconds && new Date(order?.endDate) >= currentTimeInMilliseconds);
					reformattedContract.current_start_date = new Date(activeOrder?.startDate);
					reformattedContract.current_end_date = new Date(activeOrder?.endDate);
				}
				let mappedContract = pgMapColumns(reformattedContract, contractsColumnMappings);

				const db = await pg();

				await db.syndication.upsert_contract([mappedContract]);
			}

			if (req.query.format === 'db') {
				sfContract.last_updated = new Date();

				reformattedContract = reformatSalesforceContract(sfContract);
			}

			res.json(reformattedContract);

			next();
		}
		else {
			res.status(400);
			res.json({
				event: 'GET_CONTRACT_BY_ID_ERROR',
				error: sfContract.errorMessage
			});
		}
	}
	catch (error) {
		log.error('GET_CONTRACT_BY_ID_ERROR', {
			route: req.route.path,
			error
		});

		res.sendStatus(500);
	}
};
