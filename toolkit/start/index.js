const { Task } = require('@dotcom-tool-kit/base');
const { spawn } = require('child_process');
const { hookFork, waitOnExit } = require('@dotcom-tool-kit/logger');
const Doppler = require('@dotcom-tool-kit/doppler');

class SyndicationAPITask extends Task {
  async run({ config }) {
		let dopplerEnv;

		if (!process.env.CI) {
      const doppler = new Doppler.DopplerEnvVars(this.logger, 'dev', config.pluginOptions['@dotcom-tool-kit/doppler']?.options);
			dopplerEnv = await doppler.get();
		}

		this.logger.info('running next-syndication-api');
		const args = ['start','procfile.json'];

		const env = Object.assign({}, process.env, dopplerEnv);

		const options = {
			env,
			silent: true
		};

		const child = await spawn('pm2', args, options);
		hookFork(this.logger, 'next-syndication-api run', child);
		return waitOnExit('next-syndication-api', child);
	}
}

module.exports = SyndicationAPITask;
