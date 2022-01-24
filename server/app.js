'use strict';

process.env.TZ = 'UTC';

const express = require('@financial-times/n-internal-tool');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const accessControl = require('./middleware/access-control');
const apiKey = require('./middleware/api-key');
const cache = require('./middleware/cache');
const checkIfNewSyndicationUser = require('./middleware/check-if-new-syndication-user');
const db = require('./middleware/db');
const decodeSession = require('./middleware/decode-session');
const expediteUserAuth = require('./middleware/expedite-user-auth');
const flagMaintenanceMode = require('./middleware/flag-maintenance-mode');
const getContractByIdFromSession = require('./middleware/get-contract-by-id-from-session');
const getContractByIdFromParam = require('./middleware/get-contract-by-id-from-param');
const getUserAccessAuthToken = require('./middleware/get-user-access-auth-token');
const getSyndicationLicenceForUser = require('./middleware/get-syndication-licence-for-user');
const getUserProfile = require('./middleware/get-user-profile');
const isSyndicationUser = require('./middleware/is-syndication-user');
const masquerade = require('./middleware/masquerade');
const routeMaintenanceMode = require('./middleware/route-maintenance-mode');

const app = module.exports = express({
	systemCode: 'next-syndication-api',
	graphiteName: 'syndication-api',
	withFlags: true,
	healthChecks: [
		require('../health/db-backups'),
		require('../health/db-sync-state'),
		require('../health/sqs'),
		require('../health/error-spikes'),
		require('../health/article-dl-no-data'),
		require('../health/article-dl-error-spike'),
		require('../health/archive-dl-error-spike'),
	],
	errorRateHealthcheck: {
		severity: 2
	}
});

const middleware = [
	cookieParser(),
	bodyParser.text(),
	bodyParser.json(),
	bodyParser.urlencoded({ extended: true }),
	accessControl,
	cache,
	flagMaintenanceMode,
	db,
	decodeSession,
	expediteUserAuth,
	isSyndicationUser,
	masquerade,
	getSyndicationLicenceForUser,
	getUserAccessAuthToken,
	getUserProfile,
	getContractByIdFromSession,
	checkIfNewSyndicationUser,
	routeMaintenanceMode
];

app.get('/__gtg', (req, res) => res.sendStatus(200));
app.get('/__syndication/', (req, res) => res.sendStatus(200));
// this is here to stop weird error logs, we can't find what exactly is pinging this endpoint
// so this keeps everyone happy... :P
app.get('/syndication/admin/save', (req, res) => res.sendStatus(204));

// returns the data needed to show the syndication icon and correct messaging for each UUID POSTed in the body
app.post('/syndication/resolve', middleware, require('./controllers/resolve'));
// returns content items that have been translated into the specified language
app.get('/syndication/translations', middleware, require('./controllers/translations'));

// returns the syndication user tied to this session
app.get('/syndication/user-status', middleware, require('./controllers/user-status'));
// returns the syndication contract tied to this session
app.get('/syndication/contract-status', middleware, require('./controllers/contract-status'));

// internal: get content by UUID, handy for debugging
app.get('/syndication/content/:content_id', middleware, require('./controllers/get-content-by-id'));

// download a content item for a contract
// IMPORTANT: THIS IS ONLY USED IN DEVELOPMENT. IN PRODUCTION THIS ENDPOINT IS RUN FROM ./app-dl.js
app.get('/syndication/download/:content_id', middleware, require('./controllers/download-by-content-id'));

// test to see if skipping preflight fixes the downloading videos timeout problem
// https://github.com/Financial-Times/next-service-registry/pull/1075
app.get('/__syndication/download/:content_id', middleware, require('./controllers/download-by-content-id'));

// un/save a content item to a contract
app.get('/syndication/save/:content_id', middleware, require('./controllers/save-by-content-id'));
app.delete('/syndication/save/:content_id', middleware, require('./controllers/unsave-by-content-id'));
app.post('/syndication/unsave/:content_id', middleware, require('./controllers/unsave-by-content-id'));

// get a contract's download/save history
app.get('/syndication/history', middleware, require('./controllers/history'));
// export a contract's download/save history to CSV
app.get('/syndication/export', middleware, require('./controllers/export'));

// updates a user's preferred download format
app.post('/syndication/download-format', middleware, require('./controllers/update-download-format'));

// force reload all computed tables in the DB
app.get('/syndication/reload', middleware, require('./controllers/reload'));

if (process.env.NODE_ENV !== 'production') {
	// trigger the cron worker code
	app.get('/syndication/backup', middleware, require('./controllers/backup'));
	app.get('/syndication/redshift', middleware, require('./controllers/redshift'));
	// trigger the db-persist code
	// note that this will add data to the connected database, so use only on test databases
	app.post('/syndication/db-persist', middleware, require('./controllers/nonproduction/db-persist'));
}

const contractsMiddleware = [
	cookieParser(),
	bodyParser.text(),
	bodyParser.json(),
	accessControl,
	cache,
	apiKey
];

app.post('/syndication/contracts/:contract_id/resolve', contractsMiddleware, getContractByIdFromParam, require('./controllers/resolve'));
app.get('/syndication/contracts/:contract_id', contractsMiddleware, require('./controllers/get-contract-by-id'));
