'use strict';

module.exports = exports = contentDocument => {
	return contentDocument.body.textContent.trim().split(/\s+/).length;
};
