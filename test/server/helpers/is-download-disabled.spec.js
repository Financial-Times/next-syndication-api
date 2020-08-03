"use strict";

const path = require("path");

const { expect } = require("chai");

const isDownloadDisabled = require("../../../server/helpers/is-download-disabled");

const MODULE_ID =
	path.relative(`${process.cwd()}/test`, module.id) ||
	require(path.resolve("./package.json")).name;

describe(MODULE_ID, function () {
	let item;
	let user = {};
	it("returns true if item type is package", function () {
		item = {
			type: "package",
		};
		expect(isDownloadDisabled(item, user)).to.be.true;
	});
	it("returns true if item is not avaliable", function () {
		item = {
			notAvailable: true,
		};
		expect(isDownloadDisabled(item, user)).to.be.true;
	});
	it("returns true if item canBeSyndicated is verify", function () {
		item = {
			canBeSyndicated: "verify",
		};
		expect(isDownloadDisabled(item, user)).to.be.true;
	});
	it("returns true if item.canBeSyndicated is withContributorPayment and user.contributor_content is not true", function () {
		item = {
			canBeSyndicated: "withContributorPayment",
		};
		user = {
			contributor_content: false,
		};
		expect(isDownloadDisabled(item, user)).to.be.true;
	});
	it("returns true if item canBeSyndicated is no", function () {
		item = {
			canBeSyndicated: "no",
		};
		expect(isDownloadDisabled(item, user)).to.be.true;
	});
	it("returns true if item canDownload is less than 1", function () {
		item = {
			canDownload: 0,
		};
		expect(isDownloadDisabled(item, user)).to.be.true;
	});
	it("returns false if item type is article, is avaliable, can be syndicated and can be downloaded", function () {
		item = {
			type: "article",
			notAvailable: false,
			canBeSyndicated: "yes",
			canDownload: 2,
		};
		expect(isDownloadDisabled(item, user)).to.be.false;
	});
});
