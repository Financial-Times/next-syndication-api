'use strict';

const getId = require('./content/id');
const getContractId = require('./content/contract-id');
const getType = require('./content/type');
const getTitle = require('./content/title');
const getPreviewText = require('./content/preview-text');
const getBodyText = require('./content/body-text');
const getBodyHTML = require('./content/body-html');
const getWordCount = require('./content/word-count');
const getExtension = require('./content/extension');
const getFileName = require('./content/file-name');
const getEmbargoPeriod = require('./content/embargo-period');

const getCaptions = require('./content/captions');
const getCanAllGraphicsBeSyndicated = require('./content/can-all-graphics-be-syndicated');
const getHasGraphics = require('./content/has-graphics');
const getHasTranscript = require('./content/has-transcript');

const getDownload = require('./content/download');
const getCanDownload = require('./content/can-download');
const getCanBeSynidicated = require('./content/can-be-syndicated');
const getSaved = require('./content/saved');
const getDownloaded = require('./content/downloaded');

const getTranslateDateDisplay = require('./content/translated-date-display');
const getPublishedDateDisplay = require('./content/published-date-display');

const getElasticSearchItem = require('./content/helpers/elastic-search-item');
const getSpanishItem = require('./content/helpers/spanish-item');
const getContractItem = require('./content/helpers/contract-item');

const getMessageCode = require('./content/message-code');

module.exports = exports = class ContentBuilder {
	constructor(content) {
		this.content = content;
		this.lang = 'en';
	}

	getProperty(attribute) {
		switch (attribute) {
			case 'id':
			case 'content_id':
				return getId(this);

			case 'contract_id':
				return getContractId(this);

			case 'type':
			case 'content_type':
				return getType(this);

			case 'previewText':
				return getPreviewText(this);

			case 'title':
				return getTitle(this);

			case 'bodyText':
				return getBodyText(this);

			case 'body':
			case 'bodyHTML':
			case 'bodyHTML__CLEAN':
			case 'bodyHTML__PLAIN':
				return getBodyHTML(this, attribute);

			case 'wordCount':
			case 'word_count':
				return getWordCount(this);

			case 'extension':
			case 'transcriptExtension':
				return getExtension(this, attribute);

			case 'fileName':
				return getFileName(this);

			case 'embargoPeriod':
				return getEmbargoPeriod(this);

			case 'lang':
			case 'iso_lang_code':
				return this.lang;

			case 'captions':
				return getCaptions(this);

			case 'canAllGraphicsBeSyndicated':
				return getCanAllGraphicsBeSyndicated(this);

			case 'hasGraphics':
				return getHasGraphics(this);

			case 'hasTranscript':
				return getHasTranscript(this);

			case 'download':
				return getDownload(this);

			case 'canDownload':
				return getCanDownload(this);

			case 'canBeSyndicated':
				return getCanBeSynidicated(this);

			case 'saved':
				return getSaved(this);

			case 'downloaded':
				return getDownloaded(this);

			case 'url':
			case 'webUrl':
			case 'byline':
			case 'publishedDate':
			case 'firstPublishedDate':
				return getElasticSearchItem(this, attribute);

			case 'state':
			case 'last_modified':
			case 'content_area':
			case 'translated_date':
				return getSpanishItem(this, attribute);

			case 'published_date':
				return this.getProperty('publishedDate');

			case 'publishedDateDisplay':
				return getPublishedDateDisplay(this);

			case 'translatedDate':
				return this.getProperty('translated_date');

			case 'translatedDateDisplay':
				return getTranslateDateDisplay(this);

			case 'messageCode':
				return getMessageCode(this);

			case 'notAvailable':
				return !Boolean(this.content);

			case 'licence_id':
			case 'contributor_content':
				return getContractItem(this, attribute);

			default:
				throw new Error(`Attribute not found. -> ${attribute}`);
		}
	}

	getContent(attributes, base = {}) {
		return attributes.reduce((content, attribute) => {
			const value = this.getProperty(attribute);

			if(value !== undefined){
				content[attribute] = value;
			}

			return content;
		}, Object.assign({}, base));
	}

	getContentHistory(){

		return Object.assign(
			{},
			this.content_history,
			this.getContent(['title', 'notAvailable', 'id', 'licence_id', 'contributor_content']));

	}

	setSpanishContent(content_es) {
		this.content_es = content_es;
		this.lang = 'es';

		return this;
	}

	setContentHistory(content_history) {
		this.content_history = content_history;

		return this;
	}

	setContentState(content_state) {
		this.content_state = content_state;

		return this;
	}

	setUserContract(contract) {
		this.contract = contract;

		return this;
	}

	setDownloadFormat(format) {
		this.format = format;

		return this;
	}
};
