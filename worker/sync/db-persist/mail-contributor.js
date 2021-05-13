'use strict';

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const handlebars = require('../../../server/lib/handlebars');
const { Logger } = require('../../../server/lib/logger');

const moment = require('moment-timezone');

const {
	CONTRIBUTOR_EMAIL,
	EMAIL_PLATFORM_API_KEY,
	EMAIL_PLATFORM_URL,
	ACCOUNTS_EMAIL
} = require('config');

const pg = require('../../../db/pg');

const Handlebars = handlebars();

const HTML = Handlebars.compile(fs.readFileSync(path.resolve('./server/views/partial/email_contributor_body.html.hbs'), 'utf8'), { noEscape: true });
const TXT = Handlebars.compile(fs.readFileSync(path.resolve('./server/views/partial/email_contributor_body.txt.hbs'), 'utf8'), { noEscape: true });

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({ source: MODULE_ID });

module.exports = exports = async (event) => {
	log.info('contributor-check', event);

	if (event.syndication_state !== 'withContributorPayment' || event.state !== 'started') {
		return;
	}

	const db = await pg();

	const [contributor_payment] = await db.syndication.get_contributor_purchase([event.contract_id, event.content_id]);

	if (contributor_payment && contributor_payment.email_sent !== null) {
		return;
	}

	try {
		const [contract] = await db.syndication.get_contract_data([event.contract_id]);
		event.contract = contract;

		log.debug('RECEIVED => ', event);

		event.displayDate = moment.tz(event.time, CONTRIBUTOR_EMAIL.timezone).format(CONTRIBUTOR_EMAIL.date_display_format);

		const emailPlatformHeaders = {
			'Content-Type': 'application/json',
			'Authorization': EMAIL_PLATFORM_API_KEY
		}

		const emailPlatformBody = {
			to: { address: [CONTRIBUTOR_EMAIL.to, ACCOUNTS_EMAIL] },
			from: { address: CONTRIBUTOR_EMAIL.from, name: 'With Contributor Payment Syndication alert bot' },
			subject: CONTRIBUTOR_EMAIL.subject,
			htmlContent: HTML(event),
			plainTextContent: TXT(event)
		}

		log.info('preparing to send email', {emailPlatformHeaders, emailPlatformBody})

		const res = await fetch(EMAIL_PLATFORM_URL, {
			method: 'POST',
			headers: emailPlatformHeaders,
			body: JSON.stringify(emailPlatformBody)
		})

		if (res.total_rejected_recipients !== 0) {
			log.info('Some emails were not delivered. Not delivered count', res.total_rejected_recipients)
		}

		const responseData = await res.json();

		log.info(`${MODULE_ID} MAIL SENT =>`, responseData);

		const data = contributor_payment && contributor_payment.contract_id !== null
			? contributor_payment
			: event;

		data.email_sent = new Date();

		await db.syndication.upsert(['contributor_purchase', data, 'syndication']);

		return res;
	}
	catch (e) {
		log.error(`${MODULE_ID} => `, e);

		await db.syndication.upsert(['contributor_purchase', event, 'syndication']);
	}
};
