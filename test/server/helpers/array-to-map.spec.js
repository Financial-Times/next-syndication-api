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
			id: '7324539d-cf00-4164-b0b2-e6ffb9a6b791',
		},
		{
			apiUrl:
				'https://api.ft.com/content/066a1263-bdc6-41ee-867d-7d0bad397b14',
			id: '066a1263-bdc6-41ee-867d-7d0bad397b14',
		},
		{
			apiUrl:
				'https://api.ft.com/content/71f15834-c2f3-474b-846d-5779bcaf9753',
			id: '71f15834-c2f3-474b-846d-5779bcaf9753',
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
