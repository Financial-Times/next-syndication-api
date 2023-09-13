'use strict';

const path = require('path');
const fs = require('fs');

const { Logger } = require('../../../server/lib/logger');

const AWS = require('aws-sdk');
const moment = require('moment');
const S3UploadStream = require('s3-upload-stream');
const { mkdir, rm } = require('shelljs');

const pg = require('../../../db/pg');

const {
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	REDSHIFT
} = require('config');

const S3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY,
	region: 'eu-west-1',
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({source: MODULE_ID});

module.exports = exports = async () => {
	const START = Date.now();
	const time = moment().format(REDSHIFT.date_format_file);
	const directory = path.resolve(`./tmp/redshift/${time}`);

	try {
		mkdir('-p', directory);

		log.info(`${MODULE_ID} | Running redshift backup | ${process.env.NODE_ENV}`);

		const db = await pg();

        log.info(`${MODULE_ID} | starting contract data`);
		const contract_data = await writeCSV({
			directory,
			headers: REDSHIFT.export_headers.contract_data,
			items: await db.syndication.get_redshift_contract_data([]),
			name: 'contract_data',
			time
		});

        log.info(`${MODULE_ID} | starting downloads`);
		const downloads = await writeCSV({
			directory,
			headers: REDSHIFT.export_headers.downloads,
			items: await db.syndication.get_redshift_downloads([]),
			name: 'downloads',
			time
		});

        log.info(`${MODULE_ID} | starting saved`);
		const saved_items = await writeCSV({
			directory,
			headers: REDSHIFT.export_headers.saved_items,
			items: await db.syndication.get_redshift_saved_items([]),
			name: 'saved_items',
			time
		});

		await Promise.all([
			contract_data,
			downloads,
			saved_items
		].map(async item => await upload(item)));

		log.info(`${MODULE_ID} | redshift backup uploaded to s3`);

	}
	catch (e) {
		log.error(`${MODULE_ID} => `, e);
	}

	log.info(`${MODULE_ID} complete in => ${Date.now() - START}ms`);

	rm('-rf', directory);
};

function safe(value) {
	switch (Object.prototype.toString.call(value)) {
		case '[object Date]':
			value = moment(value).format(REDSHIFT.date_format_cell);
			break;

		case '[object Array]':
		case '[object Object]':
			value = JSON.stringify(value);
			break;
	}

	if (String(value).includes('"')) {
		// remove all the double quotes in a string as it can
		// mess up the csv formatting
		value = value.replace(/"/g, '');
	}

	const NEWLINES = /\n|\r/g
	if (NEWLINES.test(String(value))) {
		// remove any newlines or carriage returns in a string as it can
		// mess up the csv formatting
		value = value.replace(NEWLINES, '');
	}

	if (String(value).includes(',')) {
		return `"${value}"`;
	}

	return value;
}

function upload({ file, name }) {
    log.info(`Upload init: ${file}`);
	return new Promise((resolve, reject) => {
		const { bucket } = REDSHIFT;
		log.info(`Upload bucket: ${bucket}`);

		const client = new S3UploadStream(S3);

		const upload = client.upload({
			Bucket: bucket.id,
			ContentType: 'text/plain',
			Key: `${bucket.directory}/${name}`,
			ServerSideEncryption: bucket.encryption_type
		});

		upload.on('error', err =>{
			log.error(`${MODULE_ID} | error: ${name} => `, err);
			reject(err);
		});
		upload.on('uploaded', res => {
			log.info(`${MODULE_ID} | uplodaded: ${name} => `, res);

			resolve(res);
		});

//		upload.on('part', part => console.log(part));

		return file.pipe(upload);
	});
}

async function writeCSV({ items, directory, headers, name, time }) {
	try {
		if (!Array.isArray(items)) {
			log.error('Items should be an array.');
			return;
		}
		log.info('Items length: ' + items.length);

		const file = path.resolve(directory, `${name}.${time}.txt`);
		const writeStream = fs.createWriteStream(file, {encoding: 'utf8'});

		// Write headers
		writeStream.write(Array.from(headers).join(',') + '\n');

		// Write rows
		for (const item of items) {
			const row = headers.map(key => (item && item[key] !== null && typeof item[key] !== 'undefined') ? safe(item[key]) : '').join(',');
			writeStream.write(row + '\n');
		}

		writeStream.end();

		log.info(`CSV created: ${name}.${time}.txt`);

		return {
			file: fs.createReadStream(file),
			name: `${name}.${time}.txt`
		};
	} catch (e) {
		log.error('Write csv error: ' + e);
	}
}
