'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { DOMParser } = require('xmldom');

const {
	FORMAT_ARTICLE_CLEAN_ELEMENTS,
	FORMAT_ARTICLE_CONTENT_TYPE,
	FORMAT_ARTICLE_STRIP_ELEMENTS,
} = require('config');

const arrayToMap = require('../../helpers/array-to-map');
const handlebars = require('../handlebars');
const Handlebars = handlebars();

const BASE_PATH = path.dirname(path.relative(process.cwd(), __dirname));

const RE_PARAGRAPHS = /<(p|h1)\s*[^>]*>(.*?)<\/\1>/gim;
const RE_REMOVE_TAGS = /<\/?[^>]*>/gm;

module.exports = exports = class DocumentBuilder {
	constructor(content) {
		this.content = content;

		this.contentDocument = new DOMParser().parseFromString(
			`<body><h3>${content.standfirst}</h3>${content.bodyHTML}</body>`,
			FORMAT_ARTICLE_CONTENT_TYPE
		);
	}

	removeElementsByTagName(tagNames = FORMAT_ARTICLE_STRIP_ELEMENTS) {
		// Defaults to FORMAT_ARTICLE_STRIP_ELEMENTS if tagNames is empty
		tagNames.forEach((tagName) =>
			Array.from(
				this.contentDocument.getElementsByTagName(tagName)
			).forEach((el) => el.parentNode.removeChild(el))
		);

		return this;
	}

	// Striping inline elements without deleting the content
	removeProprietaryElement(tagNames = FORMAT_ARTICLE_CLEAN_ELEMENTS) {
		// Defaults to FORMAT_ARTICLE_CLEAN_ELEMENTS if tagNames is empty
		tagNames.forEach((tagName) => {
			Array.from(
				this.contentDocument.getElementsByTagName(tagName)
			).forEach((el) => {
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
						.forEach((child) =>
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
			(el) => {
				if (el.nodeType !== 1) {
					el.parentNode.removeChild(el);
				}
			}
		);

		return this;
	}

	removeNonSyndicatableImages() {

		const embedsMap = arrayToMap(this.content.embeds);

		Array.from(this.contentDocument.getElementsByTagName('img')).forEach(
			(el) => {
				const imageType = el.getAttribute('data-image-type');

				let imageId =
					el.getAttribute('data-id') ||
					el.getAttribute('data-content-id');

				// to handle ids in this format (https://api.ft.com/content/{content_id}})
				imageId = imageId.split('/').pop();

				const imageDetails = embedsMap[imageId];

				if (imageType !== 'graphic' || !imageDetails || imageDetails.canBeSyndicated !== 'yes') {
					/*
						Checks if figure tags is in this format and removes them (images embeded in article)

						<figure>
							<picture>
								<img />
							<picture>
						</figure>

					*/
					if(el.parentNode.tagName === 'picture' && el.parentNode.parentNode.tagName === 'figure'){
						el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode);

					/*

						Checks if figure tags is in this format and removes them (mainImage)

						<figure>
							<img />
						</figure>

					*/
					} else if(el.parentNode.tagName === 'figure'){
						el.parentNode.parentNode.removeChild(el.parentNode);

					// Removes image tag.
					} else {
						el.parentNode.removeChild(el);
					}
				}

			}
		);

		return this;
	}

	decorateArticle(graphicsAllowed = false, graphicSyndicationFlag = false) {
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
			hasGraphics,
			canAtLeastOneGraphicBeSyndicated,
			canAllGraphicsBeSyndicated,
		} = this.content;

		const headerTemplate = Handlebars.compile(
			fs.readFileSync(
				path.resolve(
					BASE_PATH,
					'../views/partial/article_metadata_hd.html.hbs'
				),
				'utf8'
			),
			{ noEscape: true }
		);
		const footerTemplate = Handlebars.compile(
			fs.readFileSync(
				path.resolve(
					BASE_PATH,
					'../views/partial/article_metadata_ft.html.hbs'
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
			syndicatableGraphicsAvaliableMsg:
				graphicSyndicationFlag && !graphicsAllowed && canAtLeastOneGraphicBeSyndicated,
			notAllGraphicsCanBeSyndicatedMsg:
				graphicSyndicationFlag && graphicsAllowed && hasGraphics && !canAllGraphicsBeSyndicated,
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

	getDocument() {
		return this.contentDocument;
	}

	getHTMLString() {
		return this.contentDocument.toString();
	}

	getPlainText() {
		return (
			'<p>' +
			this.getHTMLString()
				.trim()
				.split('\n')
				.map((line) => line.trim())
				.join('')
				.replace(RE_PARAGRAPHS, '$2\n\n')
				.replace(RE_REMOVE_TAGS, '')
				.trim()
				.split('\n\n')
				.join('</p><p>') +
			'</p>'
		);
	}

	getXMLString() {
		const bodyXML = this.contentDocument
			.getElementsByTagName('body')[0]
			.toString();
		return bodyXML.substring(
			bodyXML.indexOf('>') + 1,
			bodyXML.lastIndexOf('<')
		); // Removes root element (innerXML)
	}

	getXMLFile() {
		const { title, byline, publishedDate, id, webUrl } = this.content;

		const bodyXML = this.getXMLString();

		const articleTemplate = Handlebars.compile(
			fs.readFileSync(
				path.resolve(BASE_PATH, '../views/article.xml.hbs'),
				'utf8'
			),
			{ noEscape: true }
		);

		const dict = {
			title,
			byline,
			bodyXML,
			year: new Date(publishedDate).getFullYear(),
			id,
			publishedDate,
			webUrl,
		};

		return Buffer.from(articleTemplate(dict), 'utf8');
	}
};
