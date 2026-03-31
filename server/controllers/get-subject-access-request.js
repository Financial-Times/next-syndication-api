'use strict';

const { Logger } = require('../lib/logger');

module.exports = exports = async (req, res, next) => {
	const log = new Logger({req, res, source: 'controllers/get-subject-access-request'});

    try {
        const {
            locals: { $DB: db },
        } = res;
        const { uuid, email } = req.body;
        const userUuid = uuid || email;

        const [dbUser] = await db.syndication.get_user([userUuid]);

        // TODO: get all the data for user and return it

        if (dbUser) {
            res.status(200);
            res.json(dbUser);
            next();
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        // TODO: make this more descriptive
        log.error('FAILED_TO_GET_USER', {
            event: 'FAILED_TO_GET_USER',
            error,
        });
    }
};
