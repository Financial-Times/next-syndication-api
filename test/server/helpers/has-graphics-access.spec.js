'use strict';
const { expect } = require('chai');

const underTest = require('../../../server/helpers/has-graphics-access');

describe('test for graphics prodcut on licence', () => {

	it('should return FALSE if products array is empty', () => {
		expect(underTest([])).to.be.false;
	});
	it('should return FALSE if products array does NOT contain an S2 product code', () => {
		const licenceWithoutGraphics = [ { code: 'S1', name: 'Syndication' },{ code: 'P2', name: 'FT.com Premium' }]

		expect(underTest(licenceWithoutGraphics)).to.be.false;
	});

	it('should return TRUE if products array does NOT contain an S2 product code', () => {
		const licenceWithoutGraphics = [ { code: 'S2', name: 'Graphics' }]

		expect(underTest(licenceWithoutGraphics)).to.be.true;
	});
})
