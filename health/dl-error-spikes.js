const nHealth = require('n-health');
const samplePeriod = 30; // minutes
const threshold = 5;

const metric = `summarize(sumSeries(next.heroku.syndication-dl.*.express.*.res.status.4*.count), "${samplePeriod}min", "sum", true)`;
const panicGuide = 'Check the heroku logs for the app for any error messages (`heroku logs --app ft-next-syndication-dl --tail --num 100` - num being the number of lines to retrieve)'

module.exports = nHealth.runCheck({
	id: 'syndication-download-4xx-spike',
	metric,
	threshold,
	name: '4xx rate for next-syndication-dl is acceptable',
	businessImpact: 'Syndication may be experiencing issues downloading articles',
	technicalSummary: `The count of 4xx responses for syndication download requests across all heroku dynos is higher than a threshold of ${threshold} over the last ${samplePeriod} minutes`,
	panicGuide,
	severity: 1,
	samplePeriod: `${samplePeriod}min`,
	type: 'graphiteThreshold'
});
