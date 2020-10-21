'use strict';
module.exports = exports = (prodList= []) => {
	return (prodList.length >= 1) ? prodList.some(product => product.code === 'S2'): false;
};
