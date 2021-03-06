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
	let decodeSessionMiddleware;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		mocks = {
			req: {
				cookies: {
					FTSession: '123',
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
			sessionDecoderClass: sandbox.stub(),
			decode: sandbox.stub(),
			next: sandbox.stub()
		};
		stubs.sessionDecoderClass.returns({ decode: stubs.decode });
		decodeSessionMiddleware = proxyquire('../../../server/middleware/decode-session', {
			'../lib/logger': stubs.logger,
			'@financial-times/session-decoder-js': stubs.sessionDecoderClass
		});
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should redirect the response to the sign in page', function () {
		mocks.req.cookies.FTSession = undefined;

		decodeSessionMiddleware(mocks.req, mocks.res, stubs.next);

		expect(mocks.res.redirect).to.have.been.calledWith(`https://accounts.ft.com/login?location=${mocks.req.originalUrl}`);
		expect(mocks.res.locals.userUuid).to.equal(undefined);
		expect(stubs.next).not.to.have.been.called;
	});

	it('should set a user uuid variable on res.locals', function () {
		stubs.decode.returns('abc');

		decodeSessionMiddleware(mocks.req, mocks.res, stubs.next);

		expect(mocks.res.sendStatus).not.to.have.been.called;
		expect(mocks.res.locals.userUuid).to.equal('abc');
		expect(stubs.next).to.have.been.called;
	});

	it('should send an bad request status code if an invalid session token is provided', function () {
		stubs.decode.throws();

		decodeSessionMiddleware(mocks.req, mocks.res, stubs.next);

		expect(mocks.res.sendStatus).to.have.been.calledWith(400);
		expect(mocks.res.locals.userUuid).to.equal(undefined);
		expect(stubs.next).not.to.have.been.called;
	});
});
