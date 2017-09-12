'use strict';

const fs = require('fs');
const path = require('path');

const { handlebars } = require('@financial-times/n-handlebars');
const { default: log } = require('@financial-times/n-logger');

const nodemailer = require('nodemailer');

const {
	CONTRIBUTOR_EMAIL
} = require('config');

const pg = require('../../db/pg');

const Handlebars = handlebars();

const transporter = nodemailer.createTransport(JSON.parse(JSON.stringify(CONTRIBUTOR_EMAIL.transport)));

const HTML = Handlebars.compile(fs.readFileSync(path.resolve('./server/views/partial/email_contributor_body.html.hbs'), 'utf8'), { noEscape: true });
const TXT = Handlebars.compile(fs.readFileSync(path.resolve('./server/views/partial/email_contributor_body.txt.hbs'), 'utf8'), { noEscape: true });

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = async (event) => {
	try {
		if (event.syndication_state !== 'withContributorPayment' || event.state !== 'started') {
			return;
		}

//		const verified = await transporter.verify();
//
//		if (!verified) {
//			throw new Error(`${MODULE_ID} UnverifiedEmailTransportError =>`, verified);
//		}

		const db = await pg();

		const [contract] = await db.syndication.get_contract_data([event.contract_id]);

		event.contract = contract;

		log.debug(`${MODULE_ID} RECEIVED => `, event);

		const transport = {
			from: CONTRIBUTOR_EMAIL.from,
			to: CONTRIBUTOR_EMAIL.to,
			subject: CONTRIBUTOR_EMAIL.subject,
			html: HTML(event),
			text: TXT(event)
		};

		const res = await transporter.sendMail(transport);

		log.debug(`${MODULE_ID} MAIL SENT =>`, res);
	}
	catch (e) {
		log.error(`${MODULE_ID} => `, e);
	}
};