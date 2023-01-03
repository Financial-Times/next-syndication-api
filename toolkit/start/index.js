const { Task } = require('@dotcom-tool-kit/types');
const { spawn } = require('child_process');
const { hookFork, waitOnExit } = require('@dotcom-tool-kit/logger');
const Vault = require('@dotcom-tool-kit/vault');


class SyndicationAPITask extends Task {
	async run() {
		const vault = new Vault.VaultEnvVars(this.logger, {
			environment: 'development'
		});
		const vaultEnv = await vault.get();
		this.logger.info('running next-syndication-api');
		const args = ['start','procfile.json'];

		const env = Object.assign({}, process.env, vaultEnv);

		const options = {
			env,
			silent: true
		};

		const child = await spawn('pm2', args, options);
		hookFork(this.logger, 'next-syndication-api run', child);
		return waitOnExit('next-syndication-api', child);
	}
}

exports.tasks = [SyndicationAPITask];
