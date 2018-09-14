'use strict';

/**
* IMPORTANT: THIS IS THE MAIN FILE RUN BY: dl.syndication.ft.com
* IMPORTANT: SEE: https://github.com/Financial-Times/next-syndication-dl
* **/

process.env.TZ = 'UTC';

const express = require('@financial-times/n-express');
const cookieParser = require('cookie-parser');

const accessControl = require('./middleware/access-control');
const cache = require('./middleware/cache');
const checkIfNewSyndicationUser = require('./middleware/check-if-new-syndication-user');
const db = require('./middleware/db');
const decodeSession = require('./middleware/decode-session');
const expediteUserAuth = require('./middleware/expedite-user-auth');
const flagMaintenanceMode = require('./middleware/flag-maintenance-mode');
const getContractByIdFromSession = require('./middleware/get-contract-by-id-from-session');
const getUserAccessAuthToken = require('./middleware/get-user-access-auth-token');
const getSyndicationLicenceForUser = require('./middleware/get-syndication-licence-for-user');
const getUserProfile = require('./middleware/get-user-profile');
const routeMaintenanceMode = require('./middleware/route-maintenance-mode');

const app = module.exports = express({
	systemCode: 'next-syndication-dl',
	withBackendAuthentication: false,
	withFlags: true
});

const middleware = [
	accessControl,
	cookieParser(),
	cache,
	flagMaintenanceMode,
	db,
	decodeSession,
	expediteUserAuth,
	getSyndicationLicenceForUser,
	getUserAccessAuthToken,
	getUserProfile,
	getContractByIdFromSession,
	checkIfNewSyndicationUser,
	routeMaintenanceMode
];

app.get('/syndication/__gtg', (req, res) => res.sendStatus(200));

// download a content item for a contract
app.get('/syndication/download/:content_id', middleware, require('./controllers/download-by-content-id'));
