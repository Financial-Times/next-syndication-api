'use strict';

const path = require('path');

const { expect } = require('chai');

const {
	DEFAULT_FORMAT,
	TEST: { FIXTURES_DIRECTORY },
} = require('config');

const enrich = require('../../../../server/lib/enrich');
const DocumentBuilder = require('../../../../server/lib/builders/document-builder');

const MODULE_ID =
	path.relative(`${process.cwd()}/test`, module.id) ||
	require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	const CONTENT_ID = '42ad255a-99f9-11e7-b83c-9588e51488a0';

	let content;
	let documentBuilder;

	beforeEach(function () {
		content = require(path.resolve(
			`${FIXTURES_DIRECTORY}/content/${CONTENT_ID}.json`
		));
		content.lang = 'en';
		content.extension = DEFAULT_FORMAT;

		const contract = {
			allowed: {
				rich_articles: false,
			},
		};

		enrich(content, contract);

		documentBuilder = new DocumentBuilder(content);
	});

	describe('constructor', function () {
		it('has content', function () {
			expect(documentBuilder.content).to.be.equal(content);
		});

		it('has contentDocument', function () {
			expect(documentBuilder.contentDocument.constructor.name).to.equal(
				'Document'
			);
		});
	});

	describe('removeElementsByTagName', function () {
		it('is function', function () {
			expect(typeof documentBuilder.removeElementsByTagName).to.equal(
				'function'
			);
		});
	});
	describe('removeProprietaryElement', function () {
		it('is function', function () {
			expect(typeof documentBuilder.removeProprietaryElement).to.equal(
				'function'
			);
		});
	});
	describe('removeWhiteSpace', function () {
		it('is function', function () {
			expect(typeof documentBuilder.removeWhiteSpace).to.equal(
				'function'
			);
		});
	});
	describe('removeNonSyndicatableImages', function () {
		it('is function', function () {
			expect(typeof documentBuilder.removeNonSyndicatableImages).to.equal(
				'function'
			);
		});
	});
	describe('decorateArticle', function () {
		it('is function', function () {
			expect(typeof documentBuilder.decorateArticle).to.equal('function');
		});
	});
	describe('getDocument', function () {
		it('is function', function () {
			expect(typeof documentBuilder.getDocument).to.equal('function');
		});
	});
	describe('getHTMLString', function () {
		it('is function', function () {
			expect(typeof documentBuilder.getHTMLString).to.equal('function');
		});
	});
	describe('getPlainText', function () {
		it('is function', function () {
			expect(typeof documentBuilder.getPlainText).to.equal('function');
		});
	});
	describe('getXMLString', function () {
		it('is function', function () {
			expect(typeof documentBuilder.getXMLString).to.equal('function');
		});
	});
	describe('getXMLFile', function () {
		it('is function', function () {
			expect(typeof documentBuilder.getXMLFile).to.equal('function');
		});
	});
});
