const { Logger: ReliabilityKitLogger, transforms } = require('@dotcom-reliability-kit/logger');

const _logger = new ReliabilityKitLogger({
	transforms: [
		transforms.legacyMask({
			denyList: [
				'email',
				'password',
				'contract_id',
				'first_name',
				'surname',
				'uri',
				'user_name',
				'x-api-key'
			],
		}),
	],
});

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
	 * "Private" Remove underscores, fullstops and spaces from a path string
	 * @param {string} path Un-sanitized string
	 */
	_sanitizePath (path = '-') {
		return String(path).replace(/[\s_.]+/g, '-');
	}

	/**
	 * Logs out errors.
	 * @param {string} message The message being logged.
	 * @param {Error} error The Error object to log.
	 */
	error (message, error) {
		this._log('error', message, error);
	}

	/**
	 * Logs out info messages.
	 * @param {string} message The message being logged.
	 * @param {object} data Optional additional data
	 */
	info (message, data) {
		this._log('info', message, data);
	}

	/**
	 * Logs out warning messages.
	 * @param {string} message The message being logged.
	 * @param {object} data Optional additional data
	 */
	warn (message, data) {
		this._log('warn', message, data);
	}

	/**
	 * Logs out debug messages.
	 * @param {string} message The message being logged.
	 * @param {object} data Optional additional data
	 */
	debug (message, data) {
		this._log('debug', message, data);
	}

	/**
	 * A successful transaction message
	 * @param {string} message
	 * @param {object} data
	 */
	success (message, data) {
		this._log('info', message, data);
	}
}

module.exports = {
	Logger
};
