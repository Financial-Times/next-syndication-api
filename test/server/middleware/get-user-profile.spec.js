'use strict';

const path = require('path');

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const nock = require('nock');
const proxyquire = require('proxyquire');

const { expect } = chai;
chai.use(sinonChai);

const {
	BASE_URI_FT_API,
	TEST: { FIXTURES_DIRECTORY }
} = require('config');

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	let db;
	let sandbox;
	let mocks;
	let stubs;
	let underTest;

	const { initDB } = require(path.resolve(`${FIXTURES_DIRECTORY}/massive`))();

	const userResponse = require(path.resolve(`${FIXTURES_DIRECTORY}/userProfile.json`));

	describe('MAINTENANCE_MODE: false', function() {
		beforeEach(function () {
			db = initDB();
			db.syndication.upsert_user.resolves([userResponse]);

			sandbox = sinon.sandbox.create();
			mocks = {
				req: {
					cookies: {
						FTSession: '123'
					},
					headers: {
						cookie: 'FTSession=123'
					}
				},
				res: {
					locals: {
						$DB: db,
						ACCESS_TOKEN_USER: 'abc.123.xyz',
						userUuid: 'abc'
					},
					sendStatus: sandbox.stub()
				}
			};
			stubs = {
	//			fetch: sandbox.stub().returns({
	//				url: `${BASE_URI_FT_API}/authorize#access_token=abc.123.xyz&scope=profile_min`
	//			}),
				logger: {
					debug: sandbox.stub(),
					error: sandbox.stub(),
					fatal: sandbox.stub(),
					info: sandbox.stub(),
					warn: sandbox.stub()
				},
				next: sandbox.stub()
			};

			underTest = proxyquire('../../../server/middleware/get-user-profile', {
				'../lib/logger': stubs.logger/*,
				'n-eager-fetch': stubs.fetch*/
			});
		});

		afterEach(function () {
			sandbox.restore();
		});

		it('should assign the returned user profile to `res.locals.user`', async function () {
			nock(BASE_URI_FT_API)
				.get(`/users/${mocks.res.locals.userUuid}/profile/basic`)
				.reply(() => {
					return [
						200,
						require(path.resolve(`${FIXTURES_DIRECTORY}/userProfile.json`)),
						{}
					];
				});


			await underTest(mocks.req, mocks.res, stubs.next);

			const { user } = mocks.res.locals;

			expect(db.syndication.upsert_user).to.have.been.calledWithExactly([
				{
					user_id: 'abc',
					first_name: 'christos',
					surname: 'constandinou',
					email: 'christos.constandinou@ft.com'
				}
			])

			expect(user).to.be.an('object')
				.and.to.eql(userResponse);
		});
	});

	describe('MAINTENANCE_MODE: true', function() {
		beforeEach(function () {
			db = initDB();
			db.syndication.upsert_user.resolves([userResponse]);

			sandbox = sinon.sandbox.create();
			mocks = {
				req: {
					cookies: {
						FTSession: '123'
					},
					headers: {
						cookie: 'FTSession=123'
					}
				},
				res: {
					locals: {
						$DB: db,
						ACCESS_TOKEN_USER: 'abc.123.xyz',
						MAINTENANCE_MODE: true,
						userUuid: 'abc'
					},
					sendStatus: sandbox.stub()
				}
			};
			stubs = {
	//			fetch: sandbox.stub().returns({
	//				url: `${BASE_URI_FT_API}/authorize#access_token=abc.123.xyz&scope=profile_min`
	//			}),
				logger: {
					debug: sandbox.stub(),
					error: sandbox.stub(),
					fatal: sandbox.stub(),
					info: sandbox.stub(),
					warn: sandbox.stub()
				},
				next: sandbox.stub()
			};

			underTest = proxyquire('../../../server/middleware/get-user-profile', {
				'../lib/logger': stubs.logger/*,
				'n-eager-fetch': stubs.fetch*/
			});
		});

		afterEach(function () {
			sandbox.restore();
		});

		it('does not try to persist the user to the database', async function() {
			nock(BASE_URI_FT_API)
				.get(`/users/${mocks.res.locals.userUuid}/profile/basic`)
				.reply(() => {
					return [
						200,
						require(path.resolve(`${FIXTURES_DIRECTORY}/userProfile.json`)),
						{}
					];
				});

			await underTest(mocks.req, mocks.res, stubs.next);

			expect(db.syndication.upsert_user).to.not.have.been.called;
		});
	});
});
