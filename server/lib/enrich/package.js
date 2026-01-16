'use strict';

const article = require('./article');

module.exports = exports = function package_(content, contract) {
  content = article(content, contract);

  return content;
};
