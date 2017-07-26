'use strict';

const { EventEmitter } = require('events');
const path = require('path');
const { Writable: WritableStream } = require('stream');

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const httpMocks = require('../../fixtures/node-mocks-http');

const HistoryTable = require('../../../db/tables/history');
const { client } = require('../../../db/connect');

const underTest = require('../../../server/controllers/history');

const { expect } = chai;
chai.use(sinonChai);

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	const items = [{
		'syndication_state': 'yes',
		'item_state': 'complete',
		'content_id': 'http://www.ft.com/thing/0c56a4f2-6bc5-11e7-bfeb-33fe0c5b7eaa',
		'user_id': '8ef593a8-eef6-448c-8560-9ca8cdca80a5',
		'contract_id': 'CA-00001558',
		'licence_id': 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
		'download_format': 'docx',
		'_id': '9807a4b6dcb3ce1188593759dd6818cd',
		'time': '2017-07-19T15:08:50.786Z',
		'version': 'v1',
		'contributor_content': false
	}, {
		'syndication_state': 'yes',
		'item_state': 'complete',
		'content_id': 'http://www.ft.com/thing/0aaee458-6c6e-11e7-bfeb-33fe0c5b7eaa',
		'user_id': '8ef593a8-eef6-448c-8560-9ca8cdca80a6',
		'contract_id': 'CA-00001558',
		'licence_id': 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
		'download_format': 'docx',
		'_id': 'f55885427fa5f8c3e2b90204a6e6b0c7',
		'time': '2017-07-19T15:08:45.881Z',
		'version': 'v1',
		'contributor_content': false
	}, {
		'syndication_state': 'yes',
		'item_state': 'save',
		'content_id': 'http://www.ft.com/thing/74447ca2-6b0b-11e7-bfeb-33fe0c5b7eaa',
		'user_id': '8ef593a8-eef6-448c-8560-9ca8cdca80a5',
		'contract_id': 'CA-00001558',
		'licence_id': 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
		'_id': '4eff4aba81093b44d2a71c36fc8e9898',
		'time': '2017-07-19T15:08:43.075Z',
		'version': 'v1',
		'contributor_content': false
	}, {
		'syndication_state': 'yes',
		'item_state': 'save',
		'content_id': 'http://www.ft.com/thing/eaef2e2c-6c61-11e7-b9c7-15af748b60d0',
		'user_id': '8ef593a8-eef6-448c-8560-9ca8cdca80a6',
		'contract_id': 'CA-00001558',
		'licence_id': 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
		'_id': 'c71c4e6cf5183996a34235bf50bc0e1d',
		'time': '2017-07-19T15:08:40.930Z',
		'version': 'v1',
		'contributor_content': false
	}];

	describe('default call', function () {
		let next;
		let req;
		let res;

		afterEach(function () {
			client.scanAsync.restore();
		});

		beforeEach(function () {
			sinon.stub(client, 'scanAsync').resolves({
				Count: items.length,
				Items: items
			});

			req = httpMocks.createRequest({
				'eventEmitter': EventEmitter,
				'connection': new EventEmitter(),
				'headers': {
					'ft-real-url': 'https://www.ft.com/syndication/history',
					'ft-real-path': '/syndication/history',
					'ft-vanity-url': '/syndication/history',
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
				'originalUrl': '/syndication/history',
				'params': {},
				'path': '/syndication/history',
				'protocol': 'http',
				'query': {

				},
				'url': '/syndication/history'
			});

			res = httpMocks.createResponse({
				req,
				writableStream: WritableStream
			});

			res.sendStatus = sinon.stub();
			res.status = sinon.stub();
			res.json = sinon.stub();
			next = sinon.stub();

			res.locals = {
				flags: {
					syndication: true,
					syndicationNew: 'on',
					syndicationRedux: 'on'
				},
				licence: {
					id: 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
					users: [],
					usersMap: {}
				},
				syndication_contract: {
					id: 'lmno'
				},
				userUuid: '8ef593a8-eef6-448c-8560-9ca8cdca80a5'
			};

			next = sinon.stub();
		});

		it('db query', async function () {
			await underTest(req, res, next);

			expect(client.scanAsync).to.be.calledWith({
				TableName: HistoryTable.TableName,
				FilterExpression: 'licence_id = :licence_id',
				ExpressionAttributeValues: {
					':licence_id': res.locals.licence.id
				}
			});
		});

		it('response: status', async function () {
			await underTest(req, res, next);

			expect(res.status).to.be.calledWith(200);
		});

		it('response: body', async function () {
			await underTest(req, res, next);

			expect(res.json).to.be.calledWith(items);
		});

		it('next', async function () {
			await underTest(req, res, next);

			expect(next).to.have.been.called;
		});
	});

	describe('show only current user\'s items', function () {
		let filteredItems;
		let user_id;
		let next;
		let req;
		let res;

		afterEach(function () {
			client.scanAsync.restore();

			filteredItems = null;
		});

		beforeEach(function () {
			user_id = '8ef593a8-eef6-448c-8560-9ca8cdca80a5';

			filteredItems = items.filter(item => item.user_id === user_id);

			sinon.stub(client, 'scanAsync').resolves({
				Count: filteredItems.length,
				Items: filteredItems
			});

			req = httpMocks.createRequest({
				'eventEmitter': EventEmitter,
				'connection': new EventEmitter(),
				'headers': {
					'ft-real-url': 'https://www.ft.com/syndication/history?show=mine',
					'ft-real-path': '/syndication/history?show=mine',
					'ft-vanity-url': '/syndication/history?show=mine',
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
				'originalUrl': '/syndication/history?show=mine',
				'params': {},
				'path': '/syndication/history',
				'protocol': 'http',
				'query': {
					show: 'mine'
				},
				'url': '/syndication/history?show=mine'
			});

			res = httpMocks.createResponse({
				req,
				writableStream: WritableStream
			});

			res.sendStatus = sinon.stub();
			res.status = sinon.stub();
			res.json = sinon.stub();
			next = sinon.stub();

			res.locals = {
				flags: {
					syndication: true,
					syndicationNew: 'on',
					syndicationRedux: 'on'
				},
				licence: {
					id: 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
					users: [],
					usersMap: {}
				},
				syndication_contract: {
					id: 'lmno'
				},
				userUuid: user_id
			};

			next = sinon.stub();
		});

		it('db query', async function () {
			await underTest(req, res, next);

			expect(client.scanAsync).to.be.calledWith({
				TableName: HistoryTable.TableName,
				FilterExpression: 'licence_id = :licence_id and user_id = :user_id',
				ExpressionAttributeValues: {
					':licence_id': res.locals.licence.id,
					':user_id': res.locals.userUuid
				}
			});
		});

		it('response: status', async function () {
			await underTest(req, res, next);

			expect(res.status).to.be.calledWith(200);
		});

		it('response: body', async function () {
			await underTest(req, res, next);

			expect(res.json).to.be.calledWith(filteredItems);
		});

		it('next', async function () {
			await underTest(req, res, next);

			expect(next).to.have.been.called;
		});
	});

	describe('show only saved items', function () {
		let filteredItems;
		let next;
		let req;
		let res;

		afterEach(function () {
			client.scanAsync.restore();

			filteredItems = null;
		});

		beforeEach(function () {
			filteredItems = items.filter(item => item.item_state === 'save');

			sinon.stub(client, 'scanAsync').resolves({
				Count: filteredItems.length,
				Items: items
			});

			req = httpMocks.createRequest({
				'eventEmitter': EventEmitter,
				'connection': new EventEmitter(),
				'headers': {
					'ft-real-url': 'https://www.ft.com/syndication/history?type=saved',
					'ft-real-path': '/syndication/history?type=saved',
					'ft-vanity-url': '/syndication/history?type=saved',
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
				'originalUrl': '/syndication/history?type=saved',
				'params': {},
				'path': '/syndication/history',
				'protocol': 'http',
				'query': {
					type: 'saved'
				},
				'url': '/syndication/history?type=saved'
			});

			res = httpMocks.createResponse({
				req,
				writableStream: WritableStream
			});

			res.sendStatus = sinon.stub();
			res.status = sinon.stub();
			res.json = sinon.stub();
			next = sinon.stub();

			res.locals = {
				flags: {
					syndication: true,
					syndicationNew: 'on',
					syndicationRedux: 'on'
				},
				licence: {
					id: 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
					users: [],
					usersMap: {}
				},
				syndication_contract: {
					id: 'lmno'
				},
				userUuid: '8ef593a8-eef6-448c-8560-9ca8cdca80a5'
			};

			next = sinon.stub();
		});

		it('db query', async function () {
			await underTest(req, res, next);

			expect(client.scanAsync).to.be.calledWith({
				TableName: HistoryTable.TableName,
				FilterExpression: 'licence_id = :licence_id',
				ExpressionAttributeValues: {
					':licence_id': res.locals.licence.id
				}
			});
		});

		it('response: status', async function () {
			await underTest(req, res, next);

			expect(res.status).to.be.calledWith(200);
		});

		it('response: body', async function () {
			await underTest(req, res, next);

			expect(res.json).to.be.calledWith(filteredItems);
		});

		it('next', async function () {
			await underTest(req, res, next);

			expect(next).to.have.been.called;
		});
	});

	describe('show only saved items', function () {
		let filteredItems;
		let next;
		let req;
		let res;

		afterEach(function () {
			client.scanAsync.restore();

			filteredItems = null;
		});

		beforeEach(function () {
			filteredItems = items.filter(item => item.item_state !== 'save');

			sinon.stub(client, 'scanAsync').resolves({
				Count: filteredItems.length,
				Items: items
			});

			req = httpMocks.createRequest({
				'eventEmitter': EventEmitter,
				'connection': new EventEmitter(),
				'headers': {
					'ft-real-url': 'https://www.ft.com/syndication/history?type=downloads',
					'ft-real-path': '/syndication/history?type=downloads',
					'ft-vanity-url': '/syndication/history?type=downloads',
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
				'originalUrl': '/syndication/history?type=downloads',
				'params': {},
				'path': '/syndication/history',
				'protocol': 'http',
				'query': {
					type: 'downloads'
				},
				'url': '/syndication/history?type=downloads'
			});

			res = httpMocks.createResponse({
				req,
				writableStream: WritableStream
			});

			res.sendStatus = sinon.stub();
			res.status = sinon.stub();
			res.json = sinon.stub();
			next = sinon.stub();

			res.locals = {
				flags: {
					syndication: true,
					syndicationNew: 'on',
					syndicationRedux: 'on'
				},
				licence: {
					id: 'c3391af1-0d46-4ddc-a922-df7c49cf1552',
					users: [],
					usersMap: {}
				},
				syndication_contract: {
					id: 'lmno'
				},
				userUuid: '8ef593a8-eef6-448c-8560-9ca8cdca80a5'
			};

			next = sinon.stub();
		});

		it('db query', async function () {
			await underTest(req, res, next);

			expect(client.scanAsync).to.be.calledWith({
				TableName: HistoryTable.TableName,
				FilterExpression: 'licence_id = :licence_id',
				ExpressionAttributeValues: {
					':licence_id': res.locals.licence.id
				}
			});
		});

		it('response: status', async function () {
			await underTest(req, res, next);

			expect(res.status).to.be.calledWith(200);
		});

		it('response: body', async function () {
			await underTest(req, res, next);

			expect(res.json).to.be.calledWith(filteredItems);
		});

		it('next', async function () {
			await underTest(req, res, next);

			expect(next).to.have.been.called;
		});
	});
});