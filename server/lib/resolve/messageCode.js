'use strict';

const path = require('path');

const { default: log } = require('@financial-times/n-logger');

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = (item, contract) => {
	try {
		for (let [code, rule] of ITER_MESSAGE_CODE_RULES) {
			if (rule(item, contract)) {
				item.messageCode = code;

				break;
			}
		}

		if (!item.messageCode) {
			item.messageCode = ERROR_CODE;
		}
	}
	catch (e) {
		log.error(`${MODULE_ID} => MessageCodeError`, e.stack);

		item.messageCode = ERROR_CODE;
	}

	return item.messageCode;
};

const ERROR_CODE = 'MSG_5000';

const MESSAGE_CODE_RULES = exports.MESSAGE_CODE_RULES = {
	MSG_4050: (item) =>
		(item.notAvailable === true),
	MSG_2000: (item, contract) =>
		(item.canBeSyndicated === 'yes' && !MESSAGE_CODE_RULES.MSG_2100(item, contract)),
	MSG_2100: (item, contract) =>
		(item.downloaded === true && !MESSAGE_CODE_RULES.MSG_2300(item, contract) && !MESSAGE_CODE_RULES.MSG_2340(item, contract)),
	MSG_2200: (item) =>
		(item.canBeSyndicated === 'verify'),
	MSG_2300: (item, contract) =>
		(item.canBeSyndicated === 'withContributorPayment' && !MESSAGE_CODE_RULES.MSG_2320(item, contract) && !MESSAGE_CODE_RULES.MSG_2340(item, contract)),
	MSG_2320: (item, contract) =>
		(item.canBeSyndicated === 'withContributorPayment' && contract.contributor_content === true && !MESSAGE_CODE_RULES.MSG_2340(item, contract)),
	MSG_2340: (item, contract) =>
		(item.canBeSyndicated === 'withContributorPayment' && contract.contributor_content === true && item.downloaded === true),
	MSG_4000: (item) =>
		(item.canBeSyndicated === 'no' || item.canBeSyndicated === null),
	MSG_4100: (item) =>
		(item.canDownload === -1),
	MSG_4200: (item) =>
		(item.canDownload === 0)
};

const ITER_MESSAGE_CODE_RULES = Object.entries(MESSAGE_CODE_RULES);
