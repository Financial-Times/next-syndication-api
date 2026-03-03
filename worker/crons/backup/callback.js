'use strict';

const { execFile } = require('child_process');
const { createReadStream/*, stat*/ } = require('fs');
const path = require('path');
const util = require('util');

const { Logger } = require('../../../server/lib/logger');

const archiver = require('archiver');
const AWS = require('aws-sdk');
const mime = require('mime-types');
const moment = require('moment');
const S3UploadStream = require('s3-upload-stream');
const { mkdir, rm } = require('shelljs');

//const pg = require('../../../db/pg');

const {
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	DB,
	DOWNLOAD_ARCHIVE_EXTENSION
} = require('config');

const S3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY,
	region: 'eu-west-1',
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const execFileAsync = util.promisify(execFile);
//const statAsync = util.promisify(stat);

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;
const log = new Logger({source: MODULE_ID});

module.exports = exports = async () => {
	const START = Date.now();
	const time = moment().format(DB.BACKUP.date_format);
	const directory = path.resolve(`./tmp/backup/${time}`);

	try {
		mkdir('-p', directory);

		log.info(`${MODULE_ID} | Running backup`);

		let { BACKUP, database, host, password, port, uri, user_name } = DB;

		const schema_dump_file = `${directory}/schema.syndication.${time}.sql`;
		const data_dump_file = `${directory}/data.syndication.${time}.sql`;

		const schema_args = ['--clean', '--create', '--schema-only', '--file', schema_dump_file];
		const data_args = ['--schema', BACKUP.schema, '--data-only', '--file', data_dump_file];

		// Add table arguments
		BACKUP.tables.forEach(table => {
			data_args.push('--table', `${BACKUP.schema}.${table}`);
		});

		if (uri) {
			schema_args.unshift(uri);
			data_args.unshift(uri);
		} else {
			if (database) {
				schema_args.unshift('--dbname', database);
				data_args.unshift('--dbname', database);
			}
			if (host) {
				schema_args.unshift('--host', host);
				data_args.unshift('--host', host);
			}
			if (port) {
				schema_args.unshift('--port', port);
				data_args.unshift('--port', port);
			}
			if (user_name) {
				schema_args.unshift('--username', user_name);
				data_args.unshift('--username', user_name);
			}
		}

		const execOptions = password ? { env: { ...process.env, PGPASSWORD: password } } : {};

		// Using execFileAsync instead of execAsync to avoid shell injection vulnerabilities and the need to escape arguments, 
		// as execFile does not execute a shell and treats arguments as literal values
		// Ref: https://nodejs.org/api/child_process.html#child_processexecfilefile-args-options-callback

		await execFileAsync(BACKUP.program, schema_args, execOptions);

		await execFileAsync(BACKUP.program, data_args, execOptions);

		const archive = archiver(DOWNLOAD_ARCHIVE_EXTENSION);

		archive.on('error', err => {
			log.error(`${MODULE_ID} ArchiveError => `, {
				error: err.stack || err
			});
		});

		archive.on('end', () => {
			log.info(`${MODULE_ID} ArchiveEnd => in ${Date.now() - START}ms`);
		});

		archive.append(createReadStream(schema_dump_file), { name: path.basename(schema_dump_file) });

		archive.append(createReadStream(data_dump_file), { name: path.basename(data_dump_file) });

		if (archive._state.finalize !== true && archive._state.finalizing !== true) {
			archive.finalize();
		}

		const file = {
			archive,
			file_name: `${BACKUP.schema}.${time}.${DOWNLOAD_ARCHIVE_EXTENSION}`
		};

		const res = await upload(file);

		log.info(`${MODULE_ID} | backup uploaded to s3`, res);
	}
	catch (e) {
		log.error(`${MODULE_ID} => `, e);
	}

	rm('-rf', directory);

	log.info(`${MODULE_ID} | removed tmp database dump files in ${directory}`);
};

function upload({ archive, file_name }) {
	return new Promise((resolve, reject) => {
		const { BACKUP: { bucket } } = DB;

		const client = new S3UploadStream(S3);

		const mime_type = mime.lookup(DOWNLOAD_ARCHIVE_EXTENSION);

		const upload = client.upload({
			Bucket: bucket.id,
			ContentType: mime_type,
			Key: `${bucket.directory}/${file_name}`,
			ServerSideEncryption: bucket.encryption_type
		});

		upload.on('error', err => reject(err));
		upload.on('uploaded', res => resolve(res));

//		upload.on('part', part => console.log(part));

		archive.pipe(upload);
	});
}
