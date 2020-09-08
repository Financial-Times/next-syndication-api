'use strict';

module.exports = exports  = (item, contract) => {
	return [
		item.type === 'package',
		item.notAvailable === true,
		item.canBeSyndicated === 'verify',
		item.canBeSyndicated === 'withContributorPayment' && contract.contributor_content !== true,
		item.canBeSyndicated === 'no',
		!item.canBeSyndicated,
		item.canDownload < 1
	].includes(true);
}
