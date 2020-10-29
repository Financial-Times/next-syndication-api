'use strict';

const path = require('path');
const util = require('util');

const AWS = require('aws-sdk');
const moment = require('moment');

const nHealthCheck = require('n-health/src/checks/check');
const nHealthStatus = require('n-health/src/checks/status');
const { Logger } = require('../server/lib/logger');

const {
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	DB
} = require('config');

const S3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY,
	region: 'eu-west-1',
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

S3.listObjectsV2Async = util.promisify(S3.listObjectsV2);

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({source: MODULE_ID});

module.exports = exports = new (class S3PostgreSQLBackupCheck extends nHealthCheck {
	constructor(...args) {
		super(...args);

		this.interval = 1000 * 60 * 30;
	}

	async tick() {
		const START = Date.now();

		this.status = nHealthStatus.PENDING;

		this.checkOutput = 'None';

		const timestamp = (moment().isSameOrAfter(moment().startOf('hour').add(10, 'minutes')) ? moment() : moment().subtract(1, 'hour')).format(DB.BACKUP.date_format);

		try {
			let res = await S3.listObjectsV2Async({
				Bucket: DB.BACKUP.bucket.id,
				MaxKeys: 5,
				Prefix: `${DB.BACKUP.bucket.directory}/${DB.BACKUP.schema}.${timestamp}`
			});

			const ok = !!res.Contents.length;

			this.status = ok === true ? nHealthStatus.PASSED : nHealthStatus.FAILED;

			log.info(`${MODULE_ID} in ${Date.now() - START}ms => ${this.checkOutput}`);
		}
		catch (e) {
			this.status = nHealthStatus.ERRORED;
		}

		return this.checkOutput;
	}
})({
	businessImpact: 'The Syndication hourly database backups have not run for the last hour, this could result in loss of data if we need to restore the database after a fatal crash.',
	name: 'Syndication hourly database backups',
/*eslint-disable*/
	panicGuide: `If you want to manually take a backup of the schema and data, you can do so by running:

\`\`\`
	# DUMP THE SCHEMA
	~$ pg_dump postgres://\${PRODUCTION_DATABASE_USER_NAME}:\${PRODUCTION_DATABASE_PASSWORD}@\${PRODUCTION_DATABASE_HOST}:\${PRODUCTION_DATABASE_PORT}/\${PRODUCTION_DATABASE_NAME}
			--clean
			--create
			--schema-only
			--file schema.syndication.YYYY-MM-DDTHH.00.sql

	# DUMP THE DATA
	~$ pg_dump postgres://\${PRODUCTION_DATABASE_USER_NAME}:\${PRODUCTION_DATABASE_PASSWORD}@\${PRODUCTION_DATABASE_HOST}:\${PRODUCTION_DATABASE_PORT}/\${PRODUCTION_DATABASE_NAME}
			--schema syndication
			--data-only
			--file data.syndication.YYYY-MM-DDTHH.00.sql
\`\`\`

Substituting the above \`\${PRODUCTION_DATABASE_ *}\` placeholders with the correct values from vault and the \`YYYY-MM-DDTHH\` for the current date rounded to the hour.`,
/*eslint-enable*/
	severity: 1,
	technicalSummary: 'Checks the database backup cron is running and that a zip file — containing the schema dump file and data dump file — for the previous hour has been uploaded to S3.'
});

if (process.env.NODE_ENV !== 'test') {
	exports.start();
}
