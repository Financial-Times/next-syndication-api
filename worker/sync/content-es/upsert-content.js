'use strict';

const path = require('path');

const AWS = require('aws-sdk');
const Slack = require('node-slack');

const esClient = require('@financial-times/n-es-client');

const ContentBuilder = require('../../../server/lib/builders/content-builder');
const pg = require('../../../db/pg');

const {
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	SLACK: {
		INCOMING_HOOK_URL_T9N: SLACK_INCOMING_HOOK_URL_T9N
	}
} = require('config');

const S3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY,
	region: 'eu-west-1',
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = async (event, message, response, subscriber) => {
	try {
		log.info(`${MODULE_ID} RECEIVED => `, event);

		const db = await pg();

		if (!Array.isArray(event.Records)) {
			log.warn(`${MODULE_ID} SKIPPING => `, JSON.stringify(event, null, 4));

			return;
		}

		const { Records: [ {
			eventName,
			s3: {
				bucket: {
					name: BUCKET_NAME
				},
				object: {
					key: FILE_NAME
				}
			}
		} ] } = event;

		const CONTENT_STATE = String(eventName).toLowerCase().includes('create') ? 'created': 'deleted';

		switch (CONTENT_STATE) {
			case 'created':
				const res = await (S3.getObject({
					Bucket: BUCKET_NAME,
					Key: FILE_NAME
				}).promise());

				const content_es = JSON.parse(res.Body.toString('utf8'));

				content_es.body = content_es.bodyHTML;
				content_es.content_area = content_es.isWeekendContent === true ? 'Spanish weekend' : 'Spanish content';
				content_es.content_id = content_es.id = content_es.uuid;
				content_es.content_type = content_es.type = 'article';
				content_es.state = CONTENT_STATE;
				content_es.translated_date = content_es.translatedDate;

				try {

					const content_en = await esClient.get(contentId);

					if (!content_en) {
						throw new Error(`ElasticSearch could not find content with ID: ${content_es.content_id}`);
					}

					content_es.word_count = new ContentBuilder(content_en)
												.setSpanishContent(content_es)
												.getProperty(
													'wordCount'
												);

					
					content_es.published_date = new Date(content_en.firstPublishedDate || content_en.publishedDate);

					await db.syndication.upsert_content_es([content_es]);

					log.info(`${MODULE_ID} UPSERTING => `, JSON.stringify(content_es, null, 4));
					
				}
				catch (error) {
					await notifyError({ error, file: FILE_NAME });
				}

				break;
			case 'deleted':
				await db.syndication.delete_content_es([path.basename(FILE_NAME, path.extname(FILE_NAME))]);

				log.info(`${MODULE_ID} DELETING => ${path.basename(FILE_NAME, path.extname(FILE_NAME))}`);

				break;
		}

		if (process.env.NODE_ENV === 'production') {
			await subscriber.ack(message);
		}
	}
	catch (e) {
		log.error(`${MODULE_ID} => `, e);
	}
};

async function notifyError ({ error, file }) {
	const slack = new Slack(SLACK_INCOMING_HOOK_URL_T9N);

	const message = {
		mrkdwn: true,
		text: `Error with file: *${file}*
\`\`\`
`
	};

	if (Object.prototype.toString.call(error) !== '[object String]') {
		if (error instanceof Error) {
			message.text += JSON.stringify(error.stack, null, 2);
		}
		else {
			message.text += JSON.stringify(error, null, 2);
		}
	}
	else {
		message.text += error;
	}

	message.text += '\n```';

	return slack.send(message);
}
