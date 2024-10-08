'use strict';

const MessageQueueEvent = require('../../../queue/message-queue-event');
const moment = require('moment');

module.exports = exports = (config) => {
	const { content, contract, lang, licence, req, user, hasGraphicSyndication } = config;
	if (content.content_type in exports) {
		config.event = new MessageQueueEvent({
			event: {
				content_id: content.id,
				content_type: content.content_type,
				has_graphics: Boolean(hasGraphicSyndication && content.hasGraphics),
				content_url: content.webUrl,
				contract_id: contract.contract_id,
				download_format: content.extension,
				iso_lang_code: lang,
				licence_id: licence.id,
				published_date: content.firstPublishedDate || content.publishedDate,
				state: 'started',
				syndication_state: String(content.canBeSyndicated),
				time: moment().toDate(),
				title: content.title,
				tracking: {
					cookie: req.headers.cookie,
					ip_address: req.ip,
					referrer: req.get('referrer'),
					session: req.cookies.FTSession,
					spoor_id: req.cookies['spoor-id'],
					url: req.originalUrl,
					user_agent: req.get('user-agent')
				},
				user: {
					id: user.user_id
				}
			}
		});

		return new exports[content.content_type](config);
	}

	throw new TypeError(`${content.content_type} cannot be downloaded for content_id#${content.content_id}`);
};

exports.article = require('./article');
exports.podcast = require('./podcast');
exports.video = require('./video');
