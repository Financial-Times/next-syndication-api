'use strict';

const path = require('path');

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { DOWNLOAD_ARTICLE_EXTENSION_OVERRIDES } = require('config');

const underTest = require('../../../server/lib/prepare-download-response');

const { expect } = chai;

chai.use(sinonChai);

const MODULE_ID = path.relative(`${process.cwd()}/test`, module.id) || require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	let res;

	beforeEach(function () {
		res = {
			attachment: sinon.spy()
		};
	});

	it('uses the configured override when `content.extension` is not a valid extension type', function () {
		let content = {
			extension: 'plain',
			fileName: 'some_awesome_article'
		};

		underTest(res, content);

		expect(res.attachment).calledWith(`${content.fileName}.${DOWNLOAD_ARTICLE_EXTENSION_OVERRIDES[content.extension]}`);
	});

	it('uses the `content.extension` when no override is configured', function () {
		let content = {
			extension: 'docx',
			fileName: 'some_awesome_article'
		};

		underTest(res, content);

		expect(res.attachment).calledWith(`${content.fileName}.${content.extension}`);
	});
});
