const MaskLogger = require('@financial-times/n-mask-logger');
const  { metrics } = require('@financial-times/n-express');


const _logger = new MaskLogger([
	'email',
	'password',
	'contract_id',
	'first_name',
	'surname',
	'uri',
	'user_name',
	'x-api-key'
]);

class Logger {

	/**
	 * @param {object} req Express request object
	 * @param {object} res Express response object
	 * @param {string} source Where the log will be called from.
	 */
	constructor ({req, res, source}) {

		const userId = (res && res.locals && res.locals.userUuid) || '-';

		const reqData =  req ? ({
			method: req.method,
			userId,
			url: req.originalUrl
		}) : {};
		this.baseLogData = Object.assign({source}, reqData);
		this.info('init');
	}

	/**
	 * "Private" function that decorates logs in a consistent style.
	 * @param {string} level The log level (automatically passed in setLogger below)
	 * @param {string} message The message to log.
	 * @param {object} data Optional additional data.
	 */
	_log (level, message = '', data = {}) {
		const logData = {
			message: message,
			data: data
		};

		_logger[level](Object.assign({}, this.baseLogData, logData));
	}

	/**
	 * "Private" function to add count metrics in a consistent style.
	 * @param {string} path
	 */
	count (path) {
		metrics.count(`${this.metricEnvironment}.${this.baseLogData.source}.${path}`);
	}

	/**
	 * "Private" Remove underscores, fullstops and spaces from a path string
	 * @param {string} path Un-sanitized string
	 */
	_sanitizePath (path = '-') {
		return path.replace(/[\s_.]+/g, '-');
	}

	/**
	 * Logs out errors.
	 * @param {string} message The message being logged.
	 * @param {Error} error The Error object to log.
	 */
	error (message, error) {
		this._log('error', message, error);
		this.count(`${this._sanitizePath(message)}.error`);
	}

	/**
	 * Logs out info messages.
	 * @param {string} message The message being logged.
	 * @param {object} data Optional additional data
	 */
	info (message, data) {
		this._log('info', message, data);
		this.count(`${this._sanitizePath(message)}.info`);
	}

	/**
	 * Logs out warning messages.
	 * @param {string} message The message being logged.
	 * @param {object} data Optional additional data
	 */
	warn (message, data) {
		this._log('warn', message, data);
		this.count(`${this._sanitizePath(message)}.warn`);
	}

	/**
	 * Logs out debug messages.
	 * @param {string} message The message being logged.
	 * @param {object} data Optional additional data
	 */
	debug (message, data) {
		this._log('debug', message, data);
		this.count(`${this._sanitizePath(message)}.debug`);
	}

	/**
	 * A successful transaction message
	 * @param {string} message
	 * @param {object} data
	 */
	success (message, data) {
		this._log('info', message, data);
		this.count(`${this._sanitizePath(message)}.success`);
	}
}

module.exports = {
	Logger
};
