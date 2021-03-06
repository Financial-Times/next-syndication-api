'use strict';

const { Logger } = require('./logger');
const log = new Logger({source: 'lib/get-contract-by-id'});
const moment = require('moment');

const {
	ASSET_TYPE_TO_DISPLAY_TYPE,
	SALESFORCE: {
		REFRESH_CONTRACT_PERIOD: SALESFORCE_REFRESH_CONTRACT_PERIOD
	}
} = require('config');

const contractsColumnMappings = require('../../db/pg/column_mappings/contracts');
const pgMapColumns = require('../../db/pg/map-columns');
const pg = require('../../db/pg');
const getSalesforceContractByID = require('./get-salesforce-contract-by-id');
const reformatSalesforceContract = require('./reformat-salesforce-contract');

function decorateContract(contract, hasGraphics = false) {

	contract.contract_date = `${moment(contract.start_date).format('DD/MM/YY')} - ${moment(contract.end_date).format('DD/MM/YY')}`;

	const contentAllowed = [];

	if (Array.isArray(contract.assets)) {
		contract.assetsMap = contract.assets.reduce((acc, asset) => {

			acc[asset.asset_type] =
			acc[asset.content_type] = asset;

			if (Array.isArray(asset.content_areas)) {
				asset.content = asset.content_areas.join('; ');
			}

			return acc;
		}, {});
	}

	contract.itemsMap = contract.items.reduce((acc, asset) => {

		if (asset.download_limit > 0) {
			(hasGraphics && asset.asset_type === 'FT Article') ?
			contentAllowed.push('Rich Articles') :
			contentAllowed.push(ASSET_TYPE_TO_DISPLAY_TYPE[asset.asset_type]);
		}

		asset.hasAddendums = false;

		acc[asset.asset_type] =
		acc[asset.content_type] = asset;

		asset.assets.forEach(item => {
			item.content = item.content_set.join('; ');

			if (Array.isArray(item.addendums) && item.addendums.length) {
				asset.hasAddendums = true;
			}
		});

		return acc;
	}, {});

	switch (contentAllowed.length) {
		case 1:
			contract.content_allowed = `${contentAllowed[0]} only`;
			break;
		default:
			contract.content_allowed = `${contentAllowed.slice(0, -1).join(', ')} & ${contentAllowed[contentAllowed.length - 1]}`;
	}

	return contract;
}

module.exports = exports = async (contractId, locals = {}) => {

	const db = await pg();

	let [contract_data] = await db.syndication.get_contract_data([contractId]);

	if (locals.MASQUERADING !== true && contract_data && contract_data.contract_id !== null) {
		let last_updated = Date.now() - +contract_data.last_updated;
		if (last_updated < SALESFORCE_REFRESH_CONTRACT_PERIOD) {
			return decorateContract(contract_data, locals.hasGraphicSyndication);
		}
	}
	let contract = await getSalesforceContractByID(contractId);
	if (contract.success === true) {
		contract = reformatSalesforceContract(contract);
		contract.last_updated = new Date();

		contract = pgMapColumns(contract, contractsColumnMappings);

		if (locals && locals.licence) {
			contract.licence_id = locals.licence.id;
		}
		// If you get the error, Cannot set property '#<anonymous>' of undefined, try refreshing
		[contract_data] = await db.syndication.upsert_contract([contract]);
		[contract_data] = await db.syndication.get_contract_data([contractId]);

		log.info('CONTRACT_PERSISTED_TO_DB', {
			event: 'CONTRACT_PERSISTED_TO_DB',
			contractID: contractId
		});

		return decorateContract(contract_data, locals.hasGraphicSyndication);
	}
	else {
		throw new Error(contract.errorMessage);
	}
};
