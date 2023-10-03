'use strict';

const path = require('path');

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const { expect } = chai;
chai.use(sinonChai);

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	let sandbox;
	let mocks;
	let stubs;
	let validateSessionMiddleware;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		mocks = {
			req: {
				cookies: {
					FTSession_s: '123s'
				}
			},
			res: {
				locals: {},
				redirect: sandbox.stub(),
				sendStatus: sandbox.stub()
			}
		};
		stubs = {
			logger: {
				debug: sandbox.stub(),
				error: sandbox.stub(),
				fatal: sandbox.stub(),
				info: sandbox.stub(),
				warn: sandbox.stub()
			},
			next: sandbox.stub(),
			fetch: sandbox.stub().returns({
				ok: true,
				json: sandbox.stub().returns({
					uuid: 'uuid-12345',
				})
			})
		};
		validateSessionMiddleware = proxyquire('../../../server/middleware/validate-session', {
			'../lib/logger': stubs.logger,
			'n-eager-fetch': stubs.fetch
		});
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should redirect the response to the sign in page', async function () {
		mocks.req.cookies.FTSession_s = undefined;

		await validateSessionMiddleware(mocks.req, mocks.res, stubs.next);

		expect(mocks.res.redirect).to.have.been.calledWith(`https://accounts.ft.com/login?location=${mocks.req.originalUrl}`);
		expect(mocks.res.locals.userUuid).to.equal(undefined);
		expect(stubs.next).not.to.have.been.called;
	});

	it('should set a user uuid variable on res.locals', async function () {

		await validateSessionMiddleware(mocks.req, mocks.res, stubs.next);
		
		expect(stubs.fetch).to.have.been.called;
		expect(mocks.res.sendStatus).not.to.have.been.called;
		expect(mocks.res.locals.userUuid).to.equal('uuid-12345');
		expect(stubs.next).to.have.been.called;
	});

	it('should send an bad request status code if an invalid session token is provided', async function () {
		stubs.fetch.throws();

		await validateSessionMiddleware(mocks.req, mocks.res, stubs.next);
		expect(stubs.fetch).to.have.been.called;
		expect(mocks.res.sendStatus).to.have.been.calledWith(400);
		expect(mocks.res.locals.userUuid).to.equal(undefined);
		expect(stubs.next).not.to.have.been.called;
	});
});
