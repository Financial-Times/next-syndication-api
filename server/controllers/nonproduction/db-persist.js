'use strict';

const { Logger } = require('../../lib/logger');

const ACL = {
	user: false,
	superuser: false,
	superdooperuser: true
};

/* values for the post request
* saved and deleted run in upsert history, started runs in mail contributor
* you can also override any of the base dummy event items
* expected body:
{
	"state": "[saved|deleted|started]",
	"user": {
		"first_name": stringValue,
		"surname": stringValue,
		"email": stringValue,
		"id": valid User ID that is already in the syndication database (e.g. any dev with S1 product)
	},
	"_id": random ID string,
	"content_id": content ID for an article,
	"content_url": content url matching that article,
	"user_id": same user ID as above
}
*/
module.exports = exports = async (req, res) => {
	const log = new Logger({req, res, source: 'controllers/nonproduction/db-persist'});
	try {
		const { locals: { user } } = res;

		if (!user || ACL[user.role] !== true) {
			res.sendStatus(401);

			return;
		}

		const eventSettings = req.body;
		const baseDummyEvent = {
			syndication_state: 'withContributorPayment',
			contract_id: process.env.FT_STAFF_CONTRACT_ID,
			title: 'test that db persist works',
			has_graphics: false,
			content_type: 'article',
			asset_type:'FT Article',
			contributor_content: true,
			iso_lang_code: 'en',
			licence_id: process.env.FT_STAFF_LICENCE_ID,
			time: '2021-09-23'
		};
		const dummyEvent = Object.assign(baseDummyEvent, eventSettings);

		const mailContrib = require('../../../worker/sync/db-persist/mail-contributor');
		const upsertHistory = require('../../../worker/sync/db-persist/upsert-history');

		if (dummyEvent.state === 'started') {
			await mailContrib(dummyEvent);
		} else if (dummyEvent.state === 'saved' || dummyEvent.state === 'deleted') {
			await upsertHistory(dummyEvent);
		} else {
			log.error('Please check that you passed in a valid request body');
			res.sendStatus(400);
		}
		res.status(200).end();
	}
	catch(error) {
		log.error(error);
		res.sendStatus(500);
	}
};
