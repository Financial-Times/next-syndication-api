'use strict';

/* eslint-disable */

const path = require('path');

const { expect } = require('chai');

const underTest = require('../../../../server/lib/resolve/canDownload');

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	it('returns 0', function() {
		expect(underTest(undefined, 'canDownload', { downloaded: false, type: 'http://www.ft.com/ontology/content/Video' })).to.equal(0);
	});

	it('returns 0', function() {
		expect(underTest(undefined, 'canDownload', { type: 'http://www.ft.com/ontology/content/Video' }, null, { assetsMap: { article: { download_limit: 10 } } })).to.equal(0);
	});

	it('returns 1', function() {
		expect(underTest(undefined, 'canDownload', { type: 'http://www.ft.com/ontology/content/Video' }, { downloaded: true })).to.equal(1);
	});

	it('returns 1', function() {
		expect(underTest(undefined, 'canDownload', { type: 'http://www.ft.com/ontology/content/Video' }, { downloaded: true })).to.equal(1);
	});

	it('returns 1', function() {
		expect(underTest(undefined, 'canDownload', { type: 'http://www.ft.com/ontology/content/Article' }, null, { assetsMap: { article: { download_limit: 10, current_downloads: { total: 9 } } } })).to.equal(1);
	});

	it('returns -1', function() {
		expect(underTest(undefined, 'canDownload', { type: 'http://www.ft.com/ontology/content/Video' }, null, { assetsMap: { video: { download_limit: 10, current_downloads: { total: 10 } } } })).to.equal(-1);
	});
});
