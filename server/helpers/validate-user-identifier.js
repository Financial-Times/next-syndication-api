'use strict';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = exports = (identifier) => {
	return (UUID_REGEX.test(identifier) || EMAIL_REGEX.test(identifier));
};
