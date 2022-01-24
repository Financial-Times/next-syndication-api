const nHealth = require('n-health');
const threshold = 5;
const samplePeriod = 24; // hours

module.exports = nHealth.runCheck({
	type: 'graphiteThreshold',
	metric: 'sumSeries(next.heroku.syndication-dl.web_*.undefined.controllers_downloads-by-content-id.article-download-complete)',
	threshold,
	direction: 'below',
	samplePeriod: `${samplePeriod}hour`,
	name: 'Less than 5 syndication article downloads seen in a day.',
	id: 'next-syndication-api-missing-article-downloads',
	severity: 1,
	businessImpact: 'The article download feature in Syndication is either malfunctioning or we are not capturing this traffic',
	technicalSummary: 'There are less than 5 article downloads registered in Graphite for Syndication in the last 24 hours.',
	panicGuide: 'Check the heroku logs for the app for any error messages. Check Graphite/Splunk for logs of syndication article downloads. Check that the functionality is working'
})
