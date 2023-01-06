const { Task } = require('@dotcom-tool-kit/types');
const { spawn } = require('child_process');
const { hookFork, waitOnExit } = require('@dotcom-tool-kit/logger');

class SyndicationAPILogs extends Task {
	async run() {
		this.logger.info('running next-syndication-api logs');
		const args = ['logs'];

		const options = {
			silent: true
		};

		const child = await spawn('pm2', args, options);
		hookFork(this.logger, 'next-syndication-api run logs', child);
		return waitOnExit('next-syndication-api logs', child);
	}
}

exports.tasks = [SyndicationAPILogs];
