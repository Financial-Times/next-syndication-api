'use strict';

module.exports = exports = contentBuilder => {
	if (!('canDownload' in contentBuilder)) {
		const { content_es, contract, lang } = contentBuilder;

		const type = contentBuilder.getProperty('type');
		const downloaded = contentBuilder.getProperty('downloaded');

		let canDownload;

		if (downloaded === true) {
			canDownload = 1;
		} else if (contract && contract.itemsMap) {
			const asset = contract.itemsMap[type];

			if (!asset) {
				canDownload = 0;
			} else if (asset.download_limit >= 0) {
				const downloaded_total =
					asset.current_downloads.total +
					(asset.legacy_download_count || 0);
				if (asset.download_limit - downloaded_total > 0) {
					canDownload = 1;
				} else {
					canDownload = -1;
				}
			}
		} else {
			canDownload = 0;
		}

		if (lang === 'es' && contract) {
			const content_area =
				content_es.content_area ||
				content_es.content_area.toLowerCase();

			if (
				(content_area === 'spanish content' &&
					contract.allowed.spanish_content) ||
				(content_area === 'spanish weekend' &&
					contract.allowed.spanish_weekend)
			) {
				canDownload = canDownload < 0 ? canDownload : 1;
			} else {
				canDownload = 0;
			}
		}

		contentBuilder.canDownload = canDownload;
	}

	return contentBuilder.canDownload;
};
