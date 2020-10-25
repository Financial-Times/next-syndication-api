'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { DOMParser } = require('xmldom');

const handlebars = require('../handlebars');

const {
	FORMAT_ARTICLE_CLEAN_ELEMENTS,
	FORMAT_ARTICLE_CONTENT_TYPE,
	FORMAT_ARTICLE_STRIP_ELEMENTS,
} = require('config');

module.exports = exports = class DocumentBuilder {
	constructor(content) {
		this.content = content;

		this.contentDocument = new DOMParser().parseFromString(
			`<body>${content.bodyHTML}</body>`,
			FORMAT_ARTICLE_CONTENT_TYPE
		);
	}

	removeElementsByTagName(tagNames = FORMAT_ARTICLE_STRIP_ELEMENTS) {
		tagNames.forEach(tagName =>
			Array.from(
				this.contentDocument.getElementsByTagName(tagName)
			).forEach(el => el.parentNode.removeChild(el))
		);

		return this;
	}

	// first sanitize content by striping inline XML elements without deleting the content
	removeProprietaryXML(tagNames = FORMAT_ARTICLE_CLEAN_ELEMENTS) {
		tagNames.forEach(tagName => {
			Array.from(
				this.contentDocument.getElementsByTagName(tagName)
			).forEach(el => {
				if (el.parentNode.nodeName === 'p') {
					if (el.firstChild && el.firstChild.data) {
						let text = this.contentDocument.createTextNode(
							el.firstChild.data
						);

						el.parentNode.insertBefore(text, el);
					}

					el.parentNode.removeChild(el);
				} else {
					Array.from(el.childNodes)
						.reverse()
						.forEach(child =>
							el.parentNode.insertBefore(child, el)
						);

					el.parentNode.removeChild(el);
				}
			});
		});

		return this;
	}

	removeWhiteSpace() {
		Array.from(this.contentDocument.documentElement.childNodes).forEach(
			el => {
				if (el.nodeType !== 1) {
					el.parentNode.removeChild(el);
				}
			}
		);

		return this;
	}

	removeNonSyndicatableImages() {
		Array.from(this.contentDocument.getElementsByTagName('img'))
			.forEach(el => {
				const imageType = el.getAttribute('data-image-type');

				if(imageType !== 'graphic'){
					el.parentNode.removeChild(el);
				}

				const { content } = this.contentBuilder;
				let imageId = el.getAttribute('data-id') || el.getAttribute('data-content-id');

				// to handle ids in this format (https://api.ft.com/content/{content_id}})
				imageId = imageId
					.split('/')
					.pop();

				const imageDetails = content.embeds && content.embeds.find(embed => embed.id === imageId);

				if(!imageDetails || imageDetails.canBeSyndicated !== 'yes'){
					el.parentNode.removeChild(el);
				}
			});


		return this;
	}

	decorateArticle() {
		const {
			byline,
			publishedDate,
			extension,
			title,
			url,
			webUrl,
			wordCount,
			lang,
			translated_date,
			content_id,
		} = this.contentBuilder.getContent([
			'byline',
			'publishedDate',
			'extension',
			'title',
			'url',
			'webUrl',
			'wordCount',
			'lang',
			'translated_date',
			'content_id',
		]);

		const Handlebars = handlebars();

		const BASE_PATH = path.dirname(path.relative(process.cwd(), __dirname));
		const headerTemplate = Handlebars.compile(
			fs.readFileSync(
				path.resolve(
					BASE_PATH,
					'./views/partial/article_metadata_hd.html.hbs'
				),
				'utf8'
			),
			{ noEscape: true }
		);
		const footerTemplate = Handlebars.compile(
			fs.readFileSync(
				path.resolve(
					BASE_PATH,
					'./views/partial/article_metadata_ft.html.hbs'
				),
				'utf8'
			),
			{ noEscape: true }
		);

		const dict = {
			byline,
			publishedDate: moment(publishedDate).format('DD MMMM YYYY'),
			publishedYear: moment(publishedDate).format('YYYY'),
			rich: extension !== 'plain',
			title,
			webUrl: url || webUrl,
			wordCount,
		};

		if (lang && lang === 'es') {
			dict.translatedDate = moment(translated_date).format(
				'DD MMMM YYYY'
			);
			dict.translationUrl = `https://www.ft.com/republishing/spanish/${content_id}`;
			dict.translationLanguage = 'Spanish';
		}

		const headerDocument = new DOMParser().parseFromString(
			headerTemplate(dict)
		);
		const footerDocument = new DOMParser().parseFromString(
			footerTemplate(dict)
		);

		this.contentDocument.documentElement.insertBefore(
			headerDocument.documentElement,
			this.contentDocument.documentElement.firstChild
		);
		this.contentDocument.documentElement.appendChild(
			footerDocument.documentElement
		);

		return this;
	}

	getHTMLString() {
		return this.contentDocument && this.contentDocument.toString();
	}
};
