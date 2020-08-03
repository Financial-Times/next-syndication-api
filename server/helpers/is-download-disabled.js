'use strict';

module.exports = exports  = (item, user) => {
	return [
		item.type === 'package',
		item.notAvailable === true,
		item.canBeSyndicated === 'verify',
		item.canBeSyndicated === 'withContributorPayment' && user.contributor_content !== true,
		item.canBeSyndicated === 'no',
		!item.canBeSyndicated,
		item.canDownload < 1
	].includes(true);
}
