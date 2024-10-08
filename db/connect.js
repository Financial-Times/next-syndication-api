'use strict';

require('./promisify');

const AWS = require('aws-sdk');

const {
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	DEFAULT_DB_ENDPOINT
} = require('config');

const db = new AWS.DynamoDB({
	accessKeyId: AWS_ACCESS_KEY,
	endpoint: DEFAULT_DB_ENDPOINT,
	region: 'eu-west-1',
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const client = new AWS.DynamoDB.DocumentClient({
	service: db
});

module.exports = exports = { client, db };
