const nHealth = require('n-health');
const threshold = 105;
const samplePeriod = 60; // minutes

module.exports = nHealth.runCheck({
	type: 'graphiteThreshold',
	metric: `asPercent(summarize(sumSeries(next.heroku.syndication-dl.web_*.undefined.controllers_downloads-by-content-id.article-download-start), "${samplePeriod}min", "sum", true), summarize(sumSeries(next.heroku.syndication-dl.web_*.undefined.controllers_downloads-by-content-id.article-download-complete), "${samplePeriod}min", "sum", true))`,
	threshold,
	samplePeriod: `${samplePeriod}min`,
	name: 'Syndication article download failure rate is acceptable',
	id: 'next-syndication-api-article-download-error-spikes',
	severity: 1,
	businessImpact: 'More than 5% of initialized article downloads did not complete.',
	technicalSummary: `The ratio of started/completed article downloads is greater than ${threshold}%.`,
	panicGuide: 'Check the heroku logs for the app for any error messages. Check Graphite/Splunk for logs of syndication article downloads. Check that the feature is working.'
})
