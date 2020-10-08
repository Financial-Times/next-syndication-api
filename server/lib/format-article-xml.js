'use strict';

const { JSDOM } = require('jsdom');

const {
	FORMAT_ARTICLE_CLEAN_ELEMENTS,
	FORMAT_ARTICLE_STRIP_ELEMENTS,
	FORMAT_ARTICLE_CONTENT_TYPE,
	FORMAT_ARTICLE_STRIP_QUERY_SELECTOR
} = require('config');

module.exports = exports = xml => {
	const { document: contentDocument } = (new JSDOM(xml, {
		contentType: FORMAT_ARTICLE_CONTENT_TYPE
	})).window;

	removeElementsByQuerySelector(contentDocument, ...FORMAT_ARTICLE_STRIP_QUERY_SELECTOR);

	removeElementsByTagName(contentDocument, ...FORMAT_ARTICLE_STRIP_ELEMENTS);
	// first sanitize content by striping inline XML elements without deleting the content
	removeProprietaryXML(contentDocument, ...FORMAT_ARTICLE_CLEAN_ELEMENTS);
	// then remove the remaining top level XML elements with the same tagName
	removeElementsByTagName(contentDocument, 'ft-content');
	removeWhiteSpace(contentDocument);
	return contentDocument;
};

exports.removeProprietaryXML = removeProprietaryXML;
exports.removeElementsByTagName = removeElementsByTagName;
exports.removeWhiteSpace = removeWhiteSpace;


function removeElementsByQuerySelector(doc, ...querySelectors) {
	querySelectors.forEach(querySelector =>
		Array.from(doc.querySelectorAll(querySelector)).forEach(el => el.parentNode.removeChild(el)));

	return doc;
}


function removeElementsByTagName(doc, ...tagNames) {
	tagNames.forEach(tagName =>
		Array.from(doc.getElementsByTagName(tagName)).forEach(el => el.parentNode.removeChild(el)));

	return doc;
}

function removeProprietaryXML(doc, ...tagNames) {
	tagNames.forEach(tagName => {
		Array.from(doc.getElementsByTagName(tagName)).forEach(el => {
			if (el.parentNode.nodeName === 'p') {
				if (el.firstChild && el.firstChild.data) {
					let text = doc.createTextNode(el.firstChild.data);

					el.parentNode.insertBefore(text, el);
				}

				el.parentNode.removeChild(el);
			}
			else {
				Array.from(el.childNodes).reverse().forEach(child => el.parentNode.insertBefore(child, el));

				el.parentNode.removeChild(el);
			}
		});
	});

	return doc;
}

function removeWhiteSpace(doc) {
	Array.from(doc.body.childNodes).forEach(el => {
		if (el.nodeType !== 1) {
			el.parentNode.removeChild(el);
		}
	});

	return doc;
}
