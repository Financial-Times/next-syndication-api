// This dev tool uses a raw list of syndication downloads and outputs a list of who syndicated an article by a freelancer and when. For more information, see the readme. 

/* eslint-disable guard-for-in */ // removeDuplicates is from StackOverflow and this function is run manually, we can apply this rule to the whole file
/* eslint-disable no-console */ // console logs are there to track progress
const esClient = require('@financial-times/n-es-client');
const fs = require('fs');
const { downloads } = require('../syndicationDownloads');

async function getContent(articles) {

	// data we want to get from Elastic Search for each article
	const elements = ['id', 'canBeSyndicated', 'title', 'byline'];

	// map over the articles to create array to pass to esClient
	const docsToQuery = articles.map(article => {
		return { _id: article.uuid, _source: elements };
	});

	// console.log('================')
	// console.log("docsToQuery.length", docsToQuery.length);
	// console.log('================')

	// if working with HUGE files, slice the array to have length ~15000 each, esClient chokes on larger arrays. If your file is smaller, you may need to amend the code so it doesn't slice and concat and runs `const someData = await esClient.mget({ docs: docsToQuery }, 30000);` and then `const withContributorContentOnlyList = someData.filter(item => item.canBeSyndicated === 'withContributorPayment');`
	const slicedDataPart1 = docsToQuery.slice(0, 15100);
	const slicedDataPart2 = docsToQuery.slice(15100);

	const processedDataPart1 = await esClient.mget({ docs: slicedDataPart1 }, 30000);
	const processedDataPart2 = await esClient.mget({ docs: slicedDataPart2 }, 30000);

	// Filter the articles so that we're only working with articles by freelancers	
	const withContributorContentOnlyList = processedDataPart1.concat(processedDataPart2).filter(item => item.canBeSyndicated === 'withContributorPayment');

	// Remove duplicates based on the article ID
	function removeDuplicates(originalArray, prop) {
		const outputArray = [];
		const lookupObject = {};

		for (let i in originalArray) {
			lookupObject[originalArray[i][prop]] = originalArray[i];
		}

		for (let i in lookupObject) {
			outputArray.push(lookupObject[i]);
		}
		return outputArray;
	}

	const dedupedList = removeDuplicates(withContributorContentOnlyList, 'id')

	console.log('================')
	console.log('dedupedList.length', dedupedList.length);
	console.log('================')

	// Add syndication details to each article from the downloads data
	const dataForBackPay = dedupedList.map(function (article) {
		const syndicatedAt = downloads.filter(item => item.uuid === article.id);
		article.syndicationDetails = syndicatedAt;
		return article;
	})

	// Write the output data to a file
	fs.writeFile('syndicationBackpayWithNames.json', JSON.stringify(dataForBackPay), (err) => {
		if (err) throw err;
		console.log('Saved the clean file')
	})
}

getContent(downloads);
