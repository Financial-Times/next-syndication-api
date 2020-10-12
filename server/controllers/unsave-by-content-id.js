'use strict';

const esClient = require('@financial-times/n-es-client');

const log = require('../lib/logger');

const moment = require('moment');

const MessageQueueEvent = require('../../queue/message-queue-event');
const ContentBuilder = require('../lib/builders/content-builder');

const pg = require('../../db/pg');

const {
	DEFAULT_DOWNLOAD_FORMAT,
	DEFAULT_DOWNLOAD_LANGUAGE
} = require('config');

module.exports = exports = async (req, res, next) => {
	try {
		const referrer = String(req.get('referrer'));

		const lang = String(req.query.lang || (referrer.includes('/republishing/spanish') ? 'es' : DEFAULT_DOWNLOAD_LANGUAGE)).toLowerCase();

		const content_en = await esClient.get(contentId);

		const contentBuilder = new ContentBuilder(content_en)
									.setDownloadFormat(DEFAULT_DOWNLOAD_FORMAT)
		
		if(lang == 'es'){
			const db = await pg();

			[content_es] = await db.syndication.get_content_es_by_id([contentId]);

			contentBuilder.setSpanishContent(content_es);
		}

		const content = contentBuilder.getContent([
			'id',
			'content_type',
			'webUrl',
			'firstPublishedDate',
			'publishedDate',
			'canBeSyndicated',
			'title'
		]);


		res.locals.__event = new MessageQueueEvent({
			event: {
				content_id: content.id,
				content_type: content.content_type,
				content_url: content.webUrl,
				contract_id: res.locals.syndication_contract.id,
				iso_lang_code: lang,
				licence_id: res.locals.licence.id,
				published_date: content.firstPublishedDate || content.publishedDate,
				state: 'deleted',
				syndication_state: String(content.canBeSyndicated),
				time: moment().toDate(),
				title: content.title,
				tracking: {
					cookie: req.headers.cookie,
					ip_address: req.ip,
					referrer: referrer,
					session: req.cookies.FTSession,
					spoor_id: req.cookies['spoor-id'],
					url: req.originalUrl,
					user_agent: req.get('user-agent')
				},
				user: {
					email: res.locals.user.email,
					first_name: res.locals.user.first_name,
					id: res.locals.user.user_id,
					surname: res.locals.user.surname
				}
			}
		});

		await res.locals.__event.publish();

		const { locals: { $DB: db, syndication_contract } } = res;

		await db.syndication.delete_save_history_by_contract_id([syndication_contract.id, content.id]);

		const requestedWith = String(req.get('x-requested-with')).toLowerCase();

		if (referrer.includes('/republishing/save') && (requestedWith !== 'xmlhttprequest' && !requestedWith.includes('fetch'))) {
			res.redirect(referrer);

			return;
		}
		else {
			res.sendStatus(204);
		}

		next();
	}
	catch (error) {
		log.error({
			event: 'CONTENT_NOT_FOUND_ERROR',
			contentId: req.params.content_id,
			error
		});

		res.sendStatus(404);
	}
};
