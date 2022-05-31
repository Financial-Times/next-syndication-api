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
const getUserAccessAuthToken = require('./middleware/get-user-access-auth-token');
const getSyndicationLicenceForUser = require('./middleware/get-syndication-licence-for-user');
const getUserProfile = require('./middleware/get-user-profile');
const isSyndicationUser = require('./middleware/is-syndication-user');
const masquerade = require('./middleware/masquerade');
const routeMaintenanceMode = require('./middleware/route-maintenance-mode');

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

const contractsMiddleware = [
	cookieParser(),
	bodyParser.text(),
	bodyParser.json(),
	accessControl,
	cache,
	apiKey
];

module.exports = {
	middleware,
	contractsMiddleware
};
