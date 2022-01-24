const nHealth = require('n-health');
const threshold = 105;
const samplePeriod = 60; // minutes

module.exports = nHealth.runCheck({
	type: 'graphiteThreshold',
	metric: `asPercent(summarize(sumSeries(next.heroku.syndication-dl.web_*.undefined.controllers_downloads-by-content-id.archive-download-start), "${samplePeriod}min", "sum", true), summarize(sumSeries(next.heroku.syndication-dl.web_*.undefined.controllers_downloads-by-content-id.archive-download-complete), "${samplePeriod}min", "sum", true))`,
	threshold,
	samplePeriod: `${samplePeriod}min`,
	name: 'Syndication archive/video download failure rate is acceptable',
	id: 'next-syndication-api-archive-download-error-spikes',
	severity: 1,
	businessImpact: 'More than 5% of initialized archive downloads did not complete.',
	technicalSummary: `The ratio of started/completed archive downloads is greater than ${threshold}%.`,
	panicGuide: 'Check the heroku logs for the app for any error messages. Check Graphite/Splunk for logs of syndication archive downloads. Check that the feature is working.'
})
