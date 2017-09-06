'use strict';

const path = require('path');

const { default: log } = require('@financial-times/n-logger');
const fetch = require('n-eager-fetch');

const { TRACKING } = require('config');

const PACKAGE = require(path.resolve('./package.json'));
const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = async (event, message, response, subscriber) => {
	try {
		log.debug(`${MODULE_ID} RECEIVED => `, event);

		const data = JSON.parse(JSON.stringify(TRACKING.DATA));

		data.action = getTrackingAction(event.state, event.tracking.referrer);

		data.context.id = event._id;
		data.context.article_id = event.content_id;
		data.context.contractID = event.contract_id;
		data.context.appVersion = PACKAGE.version;
		data.context.referrer = event.tracking.referrer;
		data.context.route_id = event._id;
		data.context.url = event.tracking.url;

		if (event.download_format) {
			data.context.fileformat = event.download_format;
		}

		data.context.syndication_content = event.content_type;

		if (process.env.NODE_ENV !== 'production') {
			data.context.isTestEvent = true;
		}

		data.device.ip = event.tracking.ip_address;
		data.device.spoor_id = event.tracking.spoor_id;
		data.device.spoor_session = event._id;

		data.system.source = PACKAGE.name;
		data.system.version = PACKAGE.version;

		data.user = {
			ft_session: event.tracking.session,
			passport_id: event.user.passport_id
		};

		const headers = JSON.parse(JSON.stringify(TRACKING.HEADERS));

		headers['content-Length'] = new Buffer(JSON.stringify(data)).length;
		headers.cookie = event.tracking.cookie;
		headers['spoor-id'] = event.tracking.spoor_id;
		headers['spoor-ticket'] = event._id;
		headers['user-agent'] = event.tracking.user_agent;

		let res = await fetch(TRACKING.URI, {
			headers,
			method: TRACKING.METHOD,
			body: JSON.stringify(data)
		});

		if (res.ok) {
			let payload = await res.json();

			log.debug(`${MODULE_ID} PUBLISHED => ${JSON.stringify(data)} ` , payload);
		}
		else {
			let error = await res.text();

			log.error(`${MODULE_ID} ERROR => `, error);
		}

		subscriber;
	}
	catch (e) {
		log.error(`${MODULE_ID} ERROR => `, e);
	}
};

function getTrackingAction(state, referrer = '') {
	switch (state) {
		case 'complete':
			if (referrer.includes('/republishing/download')) {
				return 'redownload-completion';
			}
			else if (referrer.includes('/republishing/save')) {
				return 'download-saved-items-completion';
			}
			else {
				return 'download-completion';
			}
			break;
		case 'deleted':
			if (referrer.includes('/republishing/download')) {
				return 'delete-saved-items-downloads-page';
			}
			else {
				return 'delete-saved-items';
			}

			break;
		case 'error':
			if (referrer.includes('/republishing/download')) {
				return 'redownload-error';
			}
			else if (referrer.includes('/republishing/save')) {
				return 'error-downloading-saved-items';
			}
			else {
				return 'download-error';
			}
			break;
		case 'interrupted':
			if (referrer.includes('/republishing/download')) {
				return 'redownload-interrupted';
			}
			else if (referrer.includes('/republishing/save')) {
				return 'download-saved-items-interrupted';
			}
			else {
				return 'download-interrupted';
			}
			break;
		case 'saved':
			if (referrer.includes('/republishing/download')) {
				return 'save-for-later-downloads-page';
			}
			else {
				return 'save-for-later';
			}

			break;
		case 'started':
			if (referrer.includes('/republishing/download')) {
				return 'redownload-initiation';
			}
			else if (referrer.includes('/republishing/save')) {
				return 'download-saved-items-initiation';
			}
			else {
				return 'download-initiation';
			}
			break;
	}

	return 'UNKNOWN';
}
