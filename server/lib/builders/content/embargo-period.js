'use strict';

const moment = require('moment');

module.exports = exports = contentBuilder => {
	if (!('embargoPeriod' in contentBuilder)) {
		const { content, contract } = contentBuilder;

		const type = contentBuilder.getProperty('type');

		if (contract && contract.itemsMap) {
			const asset = contract.itemsMap[type];

			if (asset && asset.embargo_period) {
				const date = moment(
					content.firstPublishedDate || content.publishedDate
				);

				const now = moment();

				if (
					date.add(asset.embargo_period, 'days').isAfter(now, 'day')
				) {
					contentBuilder.embargoPeriod = asset.embargo_period;
				}
			}
		}
	}

	return contentBuilder.embargoPeriod || undefined;
};
