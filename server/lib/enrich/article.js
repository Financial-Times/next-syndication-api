'use strict';

const path = require('path');

const formatArticleXML = require('../format-article-xml');
const getWordCount = require('../get-word-count');
const decorateArticle = require('../decorate-article');
const toPlainText = require('../to-plain-text');

const {
	CONTENT_TYPE_ALIAS,
	DOWNLOAD_ARTICLE_FORMATS,
	DOWNLOAD_FILENAME_PREFIX
} = require('config');

const RE_BAD_CHARS = /[^A-Za-z0-9_]/gm;
const RE_SPACE = /\s/gm;

module.exports = exports = function article(content, format) {
	if (!content.content_id) {
		content.content_id = path.basename(content.id);
	}

	if (!content.content_type) {
		content.content_type = CONTENT_TYPE_ALIAS[content.type] || content.type;
	}

	content.extension = DOWNLOAD_ARTICLE_FORMATS[format] || 'docx';

	if (content.body && !content.bodyHTML) {
		content.bodyHTML = content.body;
	}

	content.hasGraphics = Boolean(content.contentStats && content.contentStats.graphics);

	// Currently embeds can have more than one item for each picture - for different screen sizes
	// We are assuming that canBeSyndicated is the same for all sizes of a picture
	// We are asking if ALL Graphics can be syndicated, which means as long as at least one item
	// can't be, the answer to this is 'no'
	const atLeastOneGraphicCantBeShared =
		content.embeds &&
		content.embeds
			.filter(
				(embed) => embed && embed.type && embed.type.endsWith("Graphic")
			)
			.some((item) => item.canBeSyndicated !== "yes");

	content.canAllGraphicsBeSyndicated = !atLeastOneGraphicCantBeShared;

	if (content.bodyHTML) {
		content.document = formatArticleXML(`<body>${content.bodyHTML}</body>`);

		content.wordCount = getWordCount(content.document);

		content.document = decorateArticle(content.document, content);

		content.bodyHTML__CLEAN = content.document.toString();

		// we need to strip all formatting — leaving only paragraphs — and pass this to pandoc for plain text
		// otherwise it will uppercase the whole article title and anything bold, as well as leave other weird
		// formatting in the text file
		content.bodyHTML__PLAIN = toPlainText(content.document.toString());
	}

	content.fileName = DOWNLOAD_FILENAME_PREFIX + content.title.replace(RE_SPACE, '_').replace(RE_BAD_CHARS, '').substring(0, 12);

	return content;
};
