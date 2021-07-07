'use strict';

const path = require('path');

const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const {
	TEST: { FIXTURES_DIRECTORY }
} = require('config');

const { expect } = chai;
chai.use(sinonChai);

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	let db;
	let massiveStub;
	let underTest;

	const { initDB } = require(path.resolve(`${FIXTURES_DIRECTORY}/massive`))();

	beforeEach(function () {
		db = initDB();
		massiveStub = sinon.stub();

		underTest = proxyquire('../../../db/pg', {
			'massive': massiveStub.resolves(db)
		});
	});

	afterEach(function () {
//		db = null;
//		underTest = null;
	});

	it('returns a new PostgreSQL DB instance', async function () {
		const DB = await underTest();

		expect(DB).to.equal(db);
	});

	it('passes the custom connect options to the PostgreSQL DB instance', async function () {
		const DB = await underTest({
			host: 'DB_HOST',
			port: 'DB_PORT',
			database: 'DB_NAME',
			user_name: 'DB_USER',
			password: 'DB_PASSWORD'
		});

		expect(massiveStub).to.have.been.calledWith({
			host: 'DB_HOST',
			port: 'DB_PORT',
			database: 'DB_NAME',
			user: 'DB_USER',
			password: 'DB_PASSWORD',
			ssl: true,
			extra: {
				ssl: {
					rejectUnauthorized: false,
				},
			}
		});

		expect(DB).to.equal(db);
	});

	it('creates a new database instance if options do not match', async function() {
		beforeEach(() => {
			db = null;
		})

		const DB = await underTest({
			uri: 'DATABASE_URL'
		});

		expect(massiveStub).to.have.been.calledWith({
			database: 'DATABASE_URL',
			user: '',
			password: '',
			port: null,
			host: null,
			ssl: true,
			extra: {
				ssl: {
					rejectUnauthorized: false,
				},
			}
		});

		expect(DB).to.equal(db);
	})

});
