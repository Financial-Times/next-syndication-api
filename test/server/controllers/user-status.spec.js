'use strict';

const { EventEmitter } = require('events');
const path = require('path');
const { Writable: WritableStream } = require('stream');

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const {
	TEST: { FIXTURES_DIRECTORY }
} = require('config');

const underTest = require('../../../server/controllers/user-status');

const httpMocks = require(path.resolve(`${FIXTURES_DIRECTORY}/node-mocks-http`));

const { expect } = chai;
chai.use(sinonChai);

const PACKAGE = require(path.resolve('./package.json'));
const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	let req;
	let res;

	beforeEach(function () {
		req = httpMocks.createRequest({
			'eventEmitter': EventEmitter,
			'connection': new EventEmitter(),
			'headers': {
				'ft-real-url': 'https://www.ft.com/syndication/user-status',
				'ft-real-path': '/syndication/user-status',
				'ft-vanity-url': '/syndication/user-status',
				'ft-flags-next-flags': '',
				'ft-flags': '-',
				'cookie': '',
				'accept-language': 'en-GB,en-US;q=0.8,en;q=0.6',
				'accept-encoding': 'gzip, deflate, sdch, br',
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
			},
			'hostname': 'localhost',
			'method': 'GET',
			'originalUrl': '/syndication/user-status',
			'params': {},
			'path': '/syndication/user-status',
			'protocol': 'http',
			'query': {
				'format': 'docx'
			},
			'url': '/syndication/user-status'
		});

		res = httpMocks.createResponse({
			req,
			writableStream: WritableStream
		});

		res.status = sinon.stub();
		res.json = sinon.stub();

		res.locals = {
			allowed: {
				contributor_content: true,
				ft_com: true,
				spanish_content: true,
				spanish_weekend: false
			},
			contract: {
				contract_id: 'lmno',
				contributor_content: true,
				items: [ {
					assets: [ {
						content: 'FT.com'
					}, {
						content: 'FT.com'
					} ]
				}, {
					assets: [ {
						content: 'Spanish content'
					} ]
				} ]
			},
			flags: {
				syndication: true

			},
			licence: { id: 'xyz' },
			isNewSyndicationUser: true,
			syndication_contract: {
				id: 'lmno'
			},
			user: {
				email: 'foo@bar.com',
				first_name: 'foo',
				user_id: 'abc',
				surname: 'bar'
			},
			userUuid: 'abc'
		};
	});

	it('return an Object of with the user\'s status', async function() {

		res.locals.allowed.rich_articles = false;
		await underTest(req, res, () => {});

		expect(res.json).to.have.been.calledWith({
			app: {
				env: process.env.NODE_ENV,
				name: PACKAGE.name,
				version: PACKAGE.version
			},
			features: {
				syndication: true
			},
			allowed: {
				contributor_content: true,
				ft_com: true,
				rich_articles: false,
				spanish_content: true,
				spanish_weekend: false
			},
			contract_id: 'lmno',
			contributor_content: true,
			licence_id: 'xyz',
			email: 'foo@bar.com',
			first_name: 'foo',
			migrated: true,
			user_id: 'abc',
			surname: 'bar'
		});
	});

	it('return an Object with the user\'s status that includes allowed.rich_article = TRUE if user has Graphics S2 code', async function() {

		res.locals.allowed.rich_articles = true;

		await underTest(req, res, () => {});
		expect(res.json).to.have.been.calledWith({
			app: {
				env: process.env.NODE_ENV,
				name: PACKAGE.name,
				version: PACKAGE.version
			},
			features: {
				syndication: true
			},
			allowed: {
				contributor_content: true,
				ft_com: true,
				rich_articles: true,
				spanish_content: true,
				spanish_weekend: false,

			},
			contract_id: 'lmno',
			contributor_content: true,
			licence_id: 'xyz',
			email: 'foo@bar.com',
			first_name: 'foo',
			migrated: true,
			user_id: 'abc',
			surname: 'bar'
		});
	});

	it('set the HTTP status to 200', async function() {
		await underTest(req, res, () => {});

		expect(res.status).to.have.been.calledWith(200);
	});
});
