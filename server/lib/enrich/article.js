'use strict';

const path = require('path');

const DocumentBuilder = require('../builders/document-builder');
const getWordCount = require('../get-word-count');

const { CONTENT_TYPE_ALIAS, DOWNLOAD_FILENAME_PREFIX } = require('config');

const RE_BAD_CHARS = /[^A-Za-z0-9_]/gm;
const RE_SPACE = /\s/gm;

module.exports = exports = function article(content, contract) {
	if (!content.content_id) {
		content.content_id = path.basename(content.id);
	}

	if (!content.content_type) {
		content.content_type = CONTENT_TYPE_ALIAS[content.type] || content.type;
	}

	content.extension = content.extension || 'docx';

	if (content.body && !content.bodyHTML) {
		content.bodyHTML = content.body;
	}

	content.wordCount = getWordCount(content);
	content.hasGraphics = Boolean(
		content.contentStats && content.contentStats.graphics
	);

	const graphicEmbeds =
		content.embeds &&
		content.embeds.filter(
			(embed) => embed && embed.type && embed.type.endsWith('Graphic')
		);

	content.canAllGraphicsBeSyndicated =
		// From MDN docs: every acts like the "for all" quantifier in mathematics.
		// In particular, for an empty array, it returns true.
		// So if the filter above returned an empty array, [].every(whatever) would return `true`
		graphicEmbeds &&
		graphicEmbeds.length > 0 &&
		graphicEmbeds.every((item) => item.canBeSyndicated === 'yes');

	content.canAtLeastOneGraphicBeSyndicated =
		content.canAllGraphicsBeSyndicated || // If all graphics can be syndicated then atleast one can be syndicated.
		(graphicEmbeds &&
			graphicEmbeds.some((item) => item.canBeSyndicated === 'yes'));

	if (content.bodyHTML && contract) {
		const documentBuilder = new DocumentBuilder(content)
			.removeElementsByTagName()
			.removeProprietaryElement();

		if (content.extension === 'docx' && contract.allowed.rich_articles) {
			documentBuilder.removeNonSyndicatableImages();
		} else {
			documentBuilder.removeElementsByTagName(['img', 'figure']);
		}

		documentBuilder
			.removeWhiteSpace()
			.decorateArticle(contract.allowed.rich_articles);

		content.document = documentBuilder.getDocument();
		content.bodyHTML__CLEAN = documentBuilder.getHTMLString();

		// we need to strip all formatting — leaving only paragraphs — and pass this to pandoc for plain text
		// otherwise it will uppercase the whole article title and anything bold, as well as leave other weird
		// formatting in the text file
		content.bodyHTML__PLAIN = documentBuilder.getPlainText();
	}

	content.fileName =
		DOWNLOAD_FILENAME_PREFIX +
		content.title
			.replace(RE_SPACE, '_')
			.replace(RE_BAD_CHARS, '')
			.substring(0, 12);

	return content;
};
