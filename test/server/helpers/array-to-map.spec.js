'use strict';

const path = require('path');

const { expect } = require('chai');

const arrayToMap = require('../../../server/helpers/array-to-map');

const MODULE_ID =
	path.relative(`${process.cwd()}/test`, module.id) ||
	require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	const arr = [
		{
			apiUrl:
				'https://api.ft.com/content/7324539d-cf00-4164-b0b2-e6ffb9a6b791',
			binaryUrl:
				'https://d1e00ek4ebabms.cloudfront.net/production/7324539d-cf00-4164-b0b2-e6ffb9a6b791.jpg',
			canBeSyndicated: 'verify',
			firstPublishedDate: '2020-10-26T12:26:11.116Z',
			id: '7324539d-cf00-4164-b0b2-e6ffb9a6b791',
			identifiers: [
				{
					authority: 'http://api.ft.com/system/cct',
					identifierValue: '7324539d-cf00-4164-b0b2-e6ffb9a6b791',
				},
			],
			publishReference:
				'tid_cct_image_7324539d-cf00-4164-b0b2-e6ffb9a6b791_1603715171116',
			publishedDate: '2020-10-26T12:26:11.116Z',
			title:
				'Kelly Johnson, who is running for the Florida state house as a Democrat in Pinellas county, outside an early voting centre with her twin daughters Esther and Brooke',
			type: 'http://www.ft.com/ontology/content/Image',
		},
		{
			apiUrl:
				'https://api.ft.com/content/066a1263-bdc6-41ee-867d-7d0bad397b14',
			binaryUrl:
				'https://d6c748xw2pzm8.cloudfront.net/prod/1c256020-155f-11eb-b7ab-a19117874c53-standard.png',
			canBeSyndicated: 'yes',
			firstPublishedDate: '2020-10-26T12:26:11.116Z',
			id: '066a1263-bdc6-41ee-867d-7d0bad397b14',
			identifiers: [
				{
					authority: 'http://api.ft.com/system/cct',
					identifierValue: '066a1263-bdc6-41ee-867d-7d0bad397b14',
				},
			],
			publishReference:
				'tid_cct_image_066a1263-bdc6-41ee-867d-7d0bad397b14_1603715171116',
			publishedDate: '2020-10-26T12:26:11.116Z',
			type: 'http://www.ft.com/ontology/content/Graphic',
		},
		{
			apiUrl:
				'https://api.ft.com/content/71f15834-c2f3-474b-846d-5779bcaf9753',
			binaryUrl:
				'https://d6c748xw2pzm8.cloudfront.net/prod/1c256020-155f-11eb-b7ab-a19117874c53-mobile.png',
			canBeSyndicated: 'yes',
			firstPublishedDate: '2020-10-26T12:26:11.116Z',
			id: '71f15834-c2f3-474b-846d-5779bcaf9753',
			identifiers: [
				{
					authority: 'http://api.ft.com/system/cct',
					identifierValue: '71f15834-c2f3-474b-846d-5779bcaf9753',
				},
			],
			publishReference:
				'tid_cct_image_71f15834-c2f3-474b-846d-5779bcaf9753_1603715171116',
			publishedDate: '2020-10-26T12:26:11.116Z',
			type: 'http://www.ft.com/ontology/content/Graphic',
		},
	];

	describe('key defaults to `id`: returns object [id]:object', function () {
		arr.map((obj) => obj.id).forEach(function (key) {
			it(`return correct object for id - ${key}`, function () {
				const arrMap = arrayToMap(arr);

				expect(arrMap[key]).to.be.eql(
					arr.find((obj) => key === obj.id)
				);
			});
		});
	});

	describe('set key to `apiUrl`; returns object [apiUrl]:object', function () {
		arr.map((obj) => obj.apiUrl).forEach(function (key) {
			it(`return correct object for apiUrl - ${key}`, function () {
				const arrMap = arrayToMap(arr, 'apiUrl');

				expect(arrMap[key]).to.be.eql(
					arr.find((obj) => key === obj.apiUrl)
				);
			});
		});
	});
});
