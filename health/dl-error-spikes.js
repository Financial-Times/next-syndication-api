const nHealth = require('n-health');
const samplePeriod = 10; // minutes

// 3 and 5 are the positions of wildcards in the chain, 0 based
// 6 is the node the count is based on, 0 based
const metric403 = 'aliasByNode(sumSeriesWithWildcards(next.heroku.$app.*.express.* _{ GET, POST, PUT }.res.status.403.count, 3, 5), 6)';
const metric404 = 'aliasByNode(sumSeriesWithWildcards(next.heroku.$app.*.express.* _{ GET, POST, PUT }.res.status.404.count, 3, 5), 6)';

const panicGuide = 'Check the heroku logs for the app for any error messages (`heroku logs --app ft-next-syndication-dl --tail --num 100` - num being the number of lines to retrieve)'

const services = [
	{
		id: 'syndication-download-403-forbidden-spike',
		metric: metric403,
		threshold: 1,
		name: '403 rate for next-syndication-dl is acceptable',
		businessImpact: 'Syndication users are experiencing issues downloading articles',
		technicalSummary: `The count of 403 (Forbidden) responses for syndication download requests across all heroku dynos is higher than a threshold of 1 over the last ${samplePeriod} minutes`,
	},
	{
		id: 'syndication-download-404-not-found-spike',
		metric: metric404,
		threshold: 5,
		name: '404 rate for next-syndication-dl is acceptable',
		businessImpact: 'Syndication users are experiencing issues downloading articles',
		technicalSummary: `The count of 404 (Not Found) responses for syndication download requests across all heroku dynos is higher than a threshold of 5 over the last ${samplePeriod} minutes`,
	}

]

module.exports = services.map(service => nHealth.runCheck(Object.assign({}, service, {panicGuide, severity: 1, samplePeriod: `${samplePeriod}min`, type: 'graphiteThreshold'})))
