const nHealth = require('n-health');
const threshold =5;
const samplePeriod = 60; // minutes

module.exports = nHealth.runCheck({
	type: 'graphiteThreshold',
	metric: `asPercent(summarize(sumSeries(next.heroku.syndication-api.web_*.express.default_route_GET.res.status.5*.count), "${samplePeriod}min", "sum", true), summarize(sumSeries(next.heroku.syndication-api.web_*.express.default_route_GET.res.status.*.count), "${samplePeriod}min", "sum", true))`,
	threshold,
	samplePeriod: `${samplePeriod}min`,
	name: '5xx rate for next-syndication-api is acceptable',
	id: 'next-syndication-api-5xx-error-spikes',
	severity: 1,
	businessImpact: `Server error rate for the syndication-api has exceeded a threshold of ${threshold * 100}% over the last ${samplePeriod} minutes.`,
	technicalSummary: `The proportion of 5xx responses for syndication API requests across all heroku dynos vs all responses is higher than a threshold of ${threshold} over the last ${samplePeriod} minutes`,
	panicGuide: 'Check the heroku logs for the app for any error messages.'
})
