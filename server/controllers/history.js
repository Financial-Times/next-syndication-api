'use strict';

const path = require('path');

const { default: log } = require('@financial-times/n-logger');

const HistoryTable = require('../../db/tables/history');
const { client } = require('../../db/connect');

const MODULE_ID = path.relative(process.cwd(), module.id) || require(path.resolve('./package.json')).name;

module.exports = exports = async (req, res, next) => {
	try {
		let FilterExpression = 'licence_id = :licence_id';
		const ExpressionAttributeValues = {
			':licence_id': res.locals.licence.id
		};

		if (req.query.show === 'mine') {
			FilterExpression += ' and user_id = :user_id';

			ExpressionAttributeValues[':user_id'] = res.locals.userUuid;
		}

		let response = await client.scanAsync({
			TableName: HistoryTable.TableName,
			FilterExpression,
			ExpressionAttributeValues
		});

		if (response) {
			if (response.Count > 0) {
				res.status(200);

				// Sort items in descending order by `time:Date`
				// This is a schwartzian transform, if you don't know what that is
				// and/or why it's being used, I suggest you look it up.
				// DO NOT try and "simplify" — and thereby slow down the sort — if you do not understand what's going on.
				let items = response.Items.map(item => {
						return [+(new Date(item.time)), item];
					})
					.sort(([a], [b]) => b - a)
					.map(([, item]) => item);

				switch (req.query.type) {
					case 'downloads':
						items = items.filter(item => item.state !== 'save');
						break;
					case 'saved':
						items = items.filter(item => item.state === 'save');
						break;
				}

				res.json(items);
			}
			else {
				res.sendStatus(204);
			}
		}
		else {
			res.sendStatus(400);
		}

		next();
	}
	catch(error) {
		log.error(`${MODULE_ID}`, {
			error: error.stack
		});

		res.sendStatus(400);
	}
};