'use strict';

const path = require('path');

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const MessageQueueEvent = require('../../../queue/message-queue-event');
const QueueSubscriber = require('../../../queue/subscriber');

const {
	TEST: { FIXTURES_DIRECTORY }
} = require('config');

const { expect } = chai;
chai.use(sinonChai);

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	let underTest;
	let db;
	let subscriber;

	const { initDB } = require(path.resolve(`${FIXTURES_DIRECTORY}/massive`))();

	afterEach(function () {
		QueueSubscriber.prototype.ack.restore();
	});

	beforeEach(function () {
		db = initDB();

		db.syndication.upsert_history.resolves([]);

		underTest = proxyquire('../../../worker/db-persist/upsert-history', {
			'../../db/pg': sinon.stub().resolves(db)
		});

		sinon.stub(QueueSubscriber.prototype, 'ack').resolves({});

		subscriber = new QueueSubscriber({});
	});

	it('persists a message queue event', async function () {
		const event = (new MessageQueueEvent({
			event: {
				content_id: 'http://www.ft.com/thing/abc',
				contract_id: 'syndication',
				download_format: 'docx',
				licence_id: 'foo',
				state: 'saved',
				time: new Date(),
				user: {
					email: 'foo@bar.com',
					firstName: 'foo',
					id: 'abc',
					lastName: 'bar'
				}
			}
		})).toJSON();

		const message = { data: event };

		await underTest(event, message, {}, subscriber);

		expect(db.syndication.upsert_history).to.be.calledWith([event]);
	});

//	it('removes it from the queue', async function () {
//		const event = (new MessageQueueEvent({
//			event: {
//				content_id: 'http://www.ft.com/thing/abc',
//				contract_id: 'syndication',
//				download_format: 'docx',
//				licence_id: 'foo',
//				state: 'saved',
//				time: new Date(),
//				user: {
//					email: 'foo@bar.com',
//					firstName: 'foo',
//					id: 'abc',
//					lastName: 'bar'
//				}
//			}
//		})).toJSON();
//
//		const message = { data: event };
//
//		await underTest(event, message, {}, subscriber);
//
//		expect(QueueSubscriber.prototype.ack).to.be.calledWith(message);
//	});
});
