process.env.FT_GRAPHITE_KEY = 'graphite_key';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server/app');
const path = require('path');
const sinon = require('sinon');

const {
	TEST: { FIXTURES_DIRECTORY },
} = require('config');
const enrich = require('../../server/lib/enrich');
const getContentById = require('../../server/lib/get-content-by-id');

chai.use(chaiHttp);
const expect = chai.expect;

const CONTENT_ID = '42ad255a-99f9-11e7-b83c-9588e51488a0';
const FILENAME = 'test.docx';

const contentJSON = require(path.resolve(
	`${FIXTURES_DIRECTORY}/content/${CONTENT_ID}.json`
));
const enrichedContent = enrich(contentJSON, {
	download_formats: {
		abc: 'docx',
	},
	allowed: {
		rich_articles: false,
	},
});

describe('Download By Content Id', () => {
	let getContentStub;

	beforeEach(() => {
		getContentStub = sinon.stub(getContentById, 'getContentById');
	});

	afterEach(() => {
		getContentStub.restore();
	});

	it('should stream the download', async () => {
		getContentStub.resolves(enrichedContent);

		const res = await chai
			.request(app)
			.get(`/syndication/download/${CONTENT_ID}`)
			.query({ format: 'docx' })
			.set('Cookie', 'FTSession=FTSession;spoor-id=spoor-id');

		expect(res).to.have.status(200);
		expect(res).to.have.header(
			'content-type',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		);
		expect(res).to.have.header(
			'content-disposition',
			`attachment; filename='${FILENAME}'`
		);
		expect(res).to.have.header('x-accel-buffering', 'no');
		expect(res).to.have.header(
			'cache-control',
			'no-cache, no-store, must-revalidate'
		);
		expect(res).to.have.header('pragma', 'no-cache');
		expect(res).to.have.header('expires', '0');
	});
});
