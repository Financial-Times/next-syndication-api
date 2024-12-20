'use strict';

const AJV = require('ajv');
const hat = require('hat');

const { SYNDICATION_DOWNLOAD_SQS_URL: DEFAULT_QUEUE_URL } = require('config');

const SchemaMessageV1 = require('../schema/message-v1.json');
const publish = require('./publish');
const { Logger } = require('../server/lib/logger');

const ajv = new AJV({
	allErrors: true,
	coerceTypes: true,
	format: 'full',
	useDefaults: true,
	verbose: true
});

const rack = hat.rack();

const PROPERTY__id = Symbol('_id');
const PROPERTY_validate = Symbol('validate');
const PROPERTY_queue_url = Symbol('queue_url');

module.exports = exports = class MessageQueueEvent {
	constructor(config = {}) {
		this.log = new Logger({source: 'queue-event'});
		let { event, schema = SchemaMessageV1, queue_url = DEFAULT_QUEUE_URL } = config;

		switch (Object.prototype.toString.call(event)) {
			case '[object MessageQueueEvent]':
				let message = event;

				event = message.toJSON();
				delete event[PROPERTY__id];

				Object.assign(this, event);

				schema = message.__schema__;

				// if this is a clone, then we want to reuse the internal `validate:Function`
				// rather than creating another identical function
				this[PROPERTY_validate] = message[PROPERTY_validate];

				break;
			case '[object Object]' :
				// `JSON.parse(JSON.stringify(event))` allows us to do a VERY FAST deep copy onto
				// `this` without using references to the passed `event:Object`
				Object.assign(this, JSON.parse(JSON.stringify(event)));

			// allow fall-through
			default:
				// in the case where no event is passed we still need to assign the internal `validate:Function`
				this[PROPERTY_validate] = ajv.compile(schema);

		}

		this.__schema__ = schema;

		this.queue_url = queue_url;

		this.validate();
	}

	get [Symbol.toStringTag]() {
		return 'MessageQueueEvent';
	}

	get _id() {
		return this.id;
	}

	set _id(id) {
		return this.id = id;
	}

	get id() {
		if (!this[PROPERTY__id]) {
			this[PROPERTY__id] = rack();
		}

		return this[PROPERTY__id];
	}

	set id(id) {
		this[PROPERTY__id] = id;

		return this[PROPERTY__id];
	}

	get queue_url() {
		return this[PROPERTY_queue_url];
	}

	set queue_url(queue_url) {
		this[PROPERTY_queue_url] = queue_url;

		return this[PROPERTY_queue_url];
	}

	clone(overwrites) {
		let event = new MessageQueueEvent({
			event: this,
			queue_url: this.queue_url,
			schema: this.__schema__
		});

		if (Object.prototype.toString.call(overwrites) === '[object Object]') {
			for (let [key, val] of Object.entries(overwrites)) {
				event[key] = val;
			}
		}

		return event;
	}

	stringify(replacer = null, space = null) {
		return JSON.stringify(this.toJSON(), replacer, space);
	}

	publish() {
		return publish(this)
			.then(success => success).catch((e) => this.log.error('SyndicationSQSQueuePublishError', e))
	}

	toJSON() {
		let json = {};

		for (let [key, val] of Object.entries(this.__schema__.properties)) {
			if (!(key in this) && Object.prototype.hasOwnProperty.call(val, 'default')) {
				this[key] = JSON.parse(JSON.stringify(val.default));
			}

			switch (Object.prototype.toString.call(this[key])) {
				case '[object Object]':
				case '[object Array]':
					json[key] = JSON.parse(JSON.stringify(this[key]));

					break;
				default:
					json[key] = this[key];
			}
		}

		// Return a cheap clone in case we have nested data structures.
		// This will also remove any undefined values from the data structure.
		return JSON.parse(JSON.stringify(json));
	}

	toSQSTransport() {
		return {
			MessageBody: this.stringify(),
			QueueUrl: this.queue_url
		};
	}

	validate() {
		return this[PROPERTY_validate](this.toJSON());
	}
};
