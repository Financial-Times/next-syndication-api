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

	// if working with HUGE files, slice the array to have length ~15000 each, esClient chokes on larger arrays
	const sliced1 = docsToQuery.slice(0, 15100);
	const sliced2 = docsToQuery.slice(15100);

	const someData1 = await esClient.mget({ docs: sliced1 }, 30000);
	const someData2 = await esClient.mget({ docs: sliced2 }, 30000);


	const notYes = someData1.concat(someData2).filter(item => item.canBeSyndicated === 'withContributorPayment');

	function removeDuplicates(originalArray, prop) {
		const newArray = [];
		const lookupObject = {};

		for (let i in originalArray) {
			lookupObject[originalArray[i][prop]] = originalArray[i];
		}

		for (let i in lookupObject) {
			newArray.push(lookupObject[i]);
		}
		return newArray;
	}

	const newArray = removeDuplicates(notYes, 'id')

	console.log('================')
	console.log('newArray.length', newArray.length);
	console.log('================')

	const dataForBackPay = newArray.map(function (article) {
		const syndicatedAt = downloads.filter(item => item.uuid === article.id);
		article.syndicationDetails = syndicatedAt;
		return article;
	})

	fs.writeFile('syndicationBackpayWithNames.json', JSON.stringify(dataForBackPay), (err) => {
		if (err) throw err;
		console.log('Saved the clean file')
	})
}

getContent(downloads);
