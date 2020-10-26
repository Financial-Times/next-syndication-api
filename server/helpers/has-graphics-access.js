'use strict';

const {GRAPHIC_SYNDICATION_PRODUCT_CODE} = require('config');
module.exports = exports = (prodList= []) => {
	return prodList.some(product => product.code === GRAPHIC_SYNDICATION_PRODUCT_CODE);
};
