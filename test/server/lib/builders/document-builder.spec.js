'use strict';

const path = require('path');

const { expect } = require('chai');

const {
	DEFAULT_FORMAT,
	FORMAT_ARTICLE_CLEAN_ELEMENTS,
	FORMAT_ARTICLE_STRIP_ELEMENTS,
	TEST: { FIXTURES_DIRECTORY },
} = require('config');

const enrich = require('../../../../server/lib/enrich');
const arrayToMap = require('../../../../server/helpers/array-to-map');
const DocumentBuilder = require('../../../../server/lib/builders/document-builder');

const MODULE_ID =
	path.relative(`${process.cwd()}/test`, module.id) ||
	require(path.resolve('./package.json')).name;

describe(MODULE_ID, function () {
	const CONTENT_ID = '42ad255a-99f9-11e7-b83c-9588e51488a0';

	let content;
	let documentBuilder;

	beforeEach(function () {
		content = Object.assign({}, require(path.resolve(
			`${FIXTURES_DIRECTORY}/content/${CONTENT_ID}.json`
		))); // Clone Content
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

	describe('removeElementsByTagName', function () {

		FORMAT_ARTICLE_STRIP_ELEMENTS.forEach(tagName => {
			it(`contentDocument should not contain any <${tagName} /> elements`, function () {
				documentBuilder.removeElementsByTagName();
				const document = documentBuilder.getDocument();

				expect(document.getElementsByTagName(tagName)).to.have.property('length').and.to.equal(0);
			});
		});

		it('returns DocumentBuilder instance', function () {
			expect(documentBuilder.removeElementsByTagName().constructor.name).to.equal(
				'DocumentBuilder'
			);
		});
	});

	describe('removeProprietaryElement', function () {

		FORMAT_ARTICLE_CLEAN_ELEMENTS.forEach(tagName => {
			it(`contentDocument should not contain any <${tagName} /> elements`, function () {
				documentBuilder.removeProprietaryElement();
				const document = documentBuilder.getDocument();

				expect(document.getElementsByTagName(tagName)).to.have.property('length').and.to.equal(0);
			});
		});

		it('returns DocumentBuilder instance', function () {
			expect(documentBuilder.removeProprietaryElement().constructor.name).to.equal(
				'DocumentBuilder'
			);
		});
	});

	describe('removeWhiteSpace', function () {

		it('contentDocument should not contain whitespace', function () {
			documentBuilder.removeWhiteSpace();
			const document = documentBuilder.getDocument();
			const hasWhiteSpace = Array.from(document.documentElement.childNodes).some((el) => el.nodeType !== 1);

			expect(hasWhiteSpace).and.to.equal(false);
		});

		it('returns DocumentBuilder instance', function () {
			expect(documentBuilder.removeWhiteSpace().constructor.name).to.equal(
				'DocumentBuilder'
			);
		});
	});

	describe('removeNonSyndicatableImages', function () {

		let embedsMap;

		before(function(){
			embedsMap = arrayToMap(content.embeds);
		})

		it('contentDocument should not contain non syndicatable image', function(){
			documentBuilder.removeNonSyndicatableImages();
			const document = documentBuilder.getDocument();

			const hasAllSyndicatableImage = Array.from(document.getElementsByTagName('img')).every((el) => {
				const imageType = el.getAttribute('data-image-type');

				if (imageType !== 'graphic') {
					return false;
				}

				let imageId =
					el.getAttribute('data-id') ||
					el.getAttribute('data-content-id');

				// to handle ids in this format (https://api.ft.com/content/{content_id}})
				imageId = imageId.split('/').pop();

				const imageDetails = embedsMap[imageId];

				if(!imageDetails){
					return false;
				}

				return imageDetails.canBeSyndicated === 'yes'
			});

			expect(hasAllSyndicatableImage).and.to.equal(true);

		});

		it('returns DocumentBuilder instance', function () {
			expect(documentBuilder.removeNonSyndicatableImages().constructor.name).to.equal(
				'DocumentBuilder'
			);
		});
	});

	describe('decorateArticle', function () {

		it('prepends a header to the HTML Document', function () {
			documentBuilder.decorateArticle()
			let el = documentBuilder.getDocument().documentElement.firstChild;

			expect(el.tagName).to.equal('header');
		});

		it('appends a footer to the HTML Document', function () {
			documentBuilder.decorateArticle();
			let el = documentBuilder.getDocument().documentElement.lastChild;

			expect(el.tagName).to.equal('footer');
		});

		it('returns DocumentBuilder instance', function () {
			expect(documentBuilder.decorateArticle().constructor.name).to.equal(
				'DocumentBuilder'
			);
		});
	});

	describe('getDocument', function () {
		it('returns Document instance', function () {
			expect(documentBuilder.getDocument().constructor.name).to.equal(
				'Document'
			);
		});
	});

	describe('getHTMLString', function () {
		it('returns string', function () {
			expect(documentBuilder.getHTMLString()).to.equal(
				'<body xmlns="http://www.w3.org/1999/xhtml">\n\t\t\t<figure class="n-content-image">\n\t\t\t\t<img src="http://com.ft.imagepublish.prod.s3.amazonaws.com/d2638930-7db3-11e7-ab01-a13271d1ee9c" data-id="https://api.ft.com/content/d2638930-7db3-11e7-ab01-a13271d1ee9c" data-image-type="image" data-original-image-width="2048" data-original-image-height="1152" alt="LONDON, ENGLAND - SEPTEMBER 27: A photo illustration of the new British five pound note, featuring security features which include a see-through window and a foil Elizabeth Tower, on September 27, 2016 in London, England. The polymer note entered circulation on September 13 and the old five pound note will cease to be legal tender in May 2017. A new polymer £10 note, featuring Jane Austen, will enter circulation in summer 2017 and a polymer £20 note featuring JMW Turner will enter circulation by 2020. (Photo by Jim Dyson/Getty Images)" width="2048" height="1152" data-copyright="© Getty"/>\n\t\t\t\t\n\t\t\t<figcaption class="n-content-image__caption">\n\t\t\t\t© Getty\n\t\t\t</figcaption>\n\t\t\n\t\t\t</figure>\n\t\t<p>The pound leapt above the $1.36 mark on Friday to its highest level since the Brexit vote, as a speech from a Bank of England policymaker hardened perceptions that the central bank is moving to raise interest rates for the first time in a decade.</p><p>Gertjan Vlieghe, a member of the <a href="/content/36ccf330-dc41-3ca1-8335-9cb1fe3ee21e">bank’s Monetary Policy Committee</a> who has previously been cautious about tightening policy, said “we are approaching the moment when the bank rate may need to rise”.</p><p>Coming a day after the MPC kept <a href="/content/f6da0ec5-c433-3cf5-91fb-c781fe8c370b">rates</a> on hold but gave a heavy signal it is minded to lift the base rate from a record low, the speech added fuel to the <a href="https://www.ft.com/topics/themes/Sterling">pound</a>’s rally. </p><p>Investors sold shorter dated government bonds, which are sensitive to changing expectations for the base rate, pushing the yield up 4 basis points to 0.42 per cent, after earlier hitting a session high above 0.48 per cent. That was the highest level since the week before the <a href="https://www.ft.com/brexit">EU referendum</a> in June last year.</p><p>UK stocks were also hard hit by the sterling move, the FTSE 100 index sliding 1.1 per cent.</p><p>“The BoE really have lined up the market for a hike,” said Jordan Rochester, a currency strategist at Nomura.</p>\n\t\t\t<figure class="n-content-image">\n\t\t\t\t<img src="http://com.ft.imagepublish.prod.s3.amazonaws.com/69837688-9a04-11e7-b83c-9588e51488a0" data-id="https://api.ft.com/content/69837688-9a04-11e7-b83c-9588e51488a0" data-image-type="graphic" data-original-image-width="600" data-original-image-height="396" alt="A graphic with no description" width="600" height="396"/>\n\t\t\t\t\n\t\t\t</figure>\n\t\t<p>Sterling was last trading at $1.3589 after earlier hitting a day high of $1.3615 — this 1.4 per cent advance leaves sterling up about 3 per cent against the dollar on the week week, which began with stronger than expected inflation figures. </p><p>The currency also powered higher against the euro, rising 1.1 per cent and was trading at just under 88p versus the euro.</p><p>Although the MPC voted 7-2 to hold rates yesterday, the commentary accompanying the decision — and Mr Vlieghe’s speech today — is convincing more investors that after talking about lifting rates earlier in the year, the MPC is now more serious about doing so. </p><p>“The possibility of a November or February hike is real, we think,” analysts at Bank of America Merrill Lynch noted. “That said, we cannot understand why the BoE would want to hike rates just as currency effects on inflation are about to fade while domestic price pressure is non-existent. They seem to be panicking about the inflation peak rather than looking ahead to the likely sharp drop next year.”</p>\n\t\t\t<aside class="n-content-recommended" role="complementary" data-editorial-component-id="component1">\n\t\t\t\t<h2 class="n-content-recommended__title">Recommended</h2>\n\t\t\t\t\n\t\t\t\t<ul><li><a href="/content/de3e1832-97cc-11e7-b83c-9588e51488a0">Will UK economy be turbocharged by sterling fall</a>?</li><li><a href="/content/d43c7982-97d1-11e7-b83c-9588e51488a0">The Bank of England’s bark is loud but it has no bite</a></li><li><a href="/content/6a21c3e0-995c-11e7-a652-cde3f882dd7b">Bank of England’s interest rate rhetoric divides opinion</a></li></ul>\n\t\t\t</aside>\n\t\t<p>Before Mr Vlieghe’s speech on Friday morning, currency analysts had thought the pound was heading to $1.35 sooner than expected, given the increasingly hawkish BoE slant and its concerns about rising inflation. Yet some have <a href="/content/6a21c3e0-995c-11e7-a652-cde3f882dd7b">reservations</a> about the shift from the bank.</p><p>Mr Vlieghe acknowledged that inflation may ease back, and that uncertainty over the outcome of the Brexit negotiations may have “a larger impact on the economy than we have seen so far”.</p><p>David Meier, an economist at Julius Baer, said he was sceptical about the shift in BoE tone, saying it was “deliberately set to stabilise further the pound sterling”.</p><p>The currency’s weakness has been a strong driver of inflation and the pound’s renewed strength “will limit the inflation overshoot”.</p><p>While strategists at Nomura now believe the BoE will raise rates in November, Mr Rochester said there remained “many doubters” in the market. But added that the notion the idea of the BoE turning hawkish to support the currency and rate markets was a conspiracy theory.</p><p>“The BoE have had a continually evolving narrative towards hiking all year and now are at the brink of action,” said Mr Rochester.</p></body>'
			);
		});
	});

	describe('getPlainText', function () {
		it('returns string', function () {
			expect(documentBuilder.getPlainText()).to.equal(
				'<p>© GettyThe pound leapt above the $1.36 mark on Friday to its highest level since the Brexit vote, as a speech from a Bank of England policymaker hardened perceptions that the central bank is moving to raise interest rates for the first time in a decade.</p><p>Gertjan Vlieghe, a member of the bank’s Monetary Policy Committee who has previously been cautious about tightening policy, said “we are approaching the moment when the bank rate may need to rise”.</p><p>Coming a day after the MPC kept rates on hold but gave a heavy signal it is minded to lift the base rate from a record low, the speech added fuel to the pound’s rally. </p><p>Investors sold shorter dated government bonds, which are sensitive to changing expectations for the base rate, pushing the yield up 4 basis points to 0.42 per cent, after earlier hitting a session high above 0.48 per cent. That was the highest level since the week before the EU referendum in June last year.</p><p>UK stocks were also hard hit by the sterling move, the FTSE 100 index sliding 1.1 per cent.</p><p>“The BoE really have lined up the market for a hike,” said Jordan Rochester, a currency strategist at Nomura.</p><p>Sterling was last trading at $1.3589 after earlier hitting a day high of $1.3615 — this 1.4 per cent advance leaves sterling up about 3 per cent against the dollar on the week week, which began with stronger than expected inflation figures. </p><p>The currency also powered higher against the euro, rising 1.1 per cent and was trading at just under 88p versus the euro.</p><p>Although the MPC voted 7-2 to hold rates yesterday, the commentary accompanying the decision — and Mr Vlieghe’s speech today — is convincing more investors that after talking about lifting rates earlier in the year, the MPC is now more serious about doing so. </p><p>“The possibility of a November or February hike is real, we think,” analysts at Bank of America Merrill Lynch noted. “That said, we cannot understand why the BoE would want to hike rates just as currency effects on inflation are about to fade while domestic price pressure is non-existent. They seem to be panicking about the inflation peak rather than looking ahead to the likely sharp drop next year.”</p><p>RecommendedWill UK economy be turbocharged by sterling fall?The Bank of England’s bark is loud but it has no biteBank of England’s interest rate rhetoric divides opinionBefore Mr Vlieghe’s speech on Friday morning, currency analysts had thought the pound was heading to $1.35 sooner than expected, given the increasingly hawkish BoE slant and its concerns about rising inflation. Yet some have reservations about the shift from the bank.</p><p>Mr Vlieghe acknowledged that inflation may ease back, and that uncertainty over the outcome of the Brexit negotiations may have “a larger impact on the economy than we have seen so far”.</p><p>David Meier, an economist at Julius Baer, said he was sceptical about the shift in BoE tone, saying it was “deliberately set to stabilise further the pound sterling”.</p><p>The currency’s weakness has been a strong driver of inflation and the pound’s renewed strength “will limit the inflation overshoot”.</p><p>While strategists at Nomura now believe the BoE will raise rates in November, Mr Rochester said there remained “many doubters” in the market. But added that the notion the idea of the BoE turning hawkish to support the currency and rate markets was a conspiracy theory.</p><p>“The BoE have had a continually evolving narrative towards hiking all year and now are at the brink of action,” said Mr Rochester.</p>'
			);
		});
	});

	describe('getXMLString', function () {
		it('returns string', function () {
			expect(documentBuilder.getXMLString()).to.equal(
				'\n\t\t\t<figure class="n-content-image">\n\t\t\t\t<img src="http://com.ft.imagepublish.prod.s3.amazonaws.com/d2638930-7db3-11e7-ab01-a13271d1ee9c" data-id="https://api.ft.com/content/d2638930-7db3-11e7-ab01-a13271d1ee9c" data-image-type="image" data-original-image-width="2048" data-original-image-height="1152" alt="LONDON, ENGLAND - SEPTEMBER 27: A photo illustration of the new British five pound note, featuring security features which include a see-through window and a foil Elizabeth Tower, on September 27, 2016 in London, England. The polymer note entered circulation on September 13 and the old five pound note will cease to be legal tender in May 2017. A new polymer £10 note, featuring Jane Austen, will enter circulation in summer 2017 and a polymer £20 note featuring JMW Turner will enter circulation by 2020. (Photo by Jim Dyson/Getty Images)" width="2048" height="1152" data-copyright="© Getty"/>\n\t\t\t\t\n\t\t\t<figcaption class="n-content-image__caption">\n\t\t\t\t© Getty\n\t\t\t</figcaption>\n\t\t\n\t\t\t</figure>\n\t\t<p>The pound leapt above the $1.36 mark on Friday to its highest level since the Brexit vote, as a speech from a Bank of England policymaker hardened perceptions that the central bank is moving to raise interest rates for the first time in a decade.</p><p>Gertjan Vlieghe, a member of the <a href="/content/36ccf330-dc41-3ca1-8335-9cb1fe3ee21e">bank’s Monetary Policy Committee</a> who has previously been cautious about tightening policy, said “we are approaching the moment when the bank rate may need to rise”.</p><p>Coming a day after the MPC kept <a href="/content/f6da0ec5-c433-3cf5-91fb-c781fe8c370b">rates</a> on hold but gave a heavy signal it is minded to lift the base rate from a record low, the speech added fuel to the <a href="https://www.ft.com/topics/themes/Sterling">pound</a>’s rally. </p><p>Investors sold shorter dated government bonds, which are sensitive to changing expectations for the base rate, pushing the yield up 4 basis points to 0.42 per cent, after earlier hitting a session high above 0.48 per cent. That was the highest level since the week before the <a href="https://www.ft.com/brexit">EU referendum</a> in June last year.</p><p>UK stocks were also hard hit by the sterling move, the FTSE 100 index sliding 1.1 per cent.</p><p>“The BoE really have lined up the market for a hike,” said Jordan Rochester, a currency strategist at Nomura.</p>\n\t\t\t<figure class="n-content-image">\n\t\t\t\t<img src="http://com.ft.imagepublish.prod.s3.amazonaws.com/69837688-9a04-11e7-b83c-9588e51488a0" data-id="https://api.ft.com/content/69837688-9a04-11e7-b83c-9588e51488a0" data-image-type="graphic" data-original-image-width="600" data-original-image-height="396" alt="A graphic with no description" width="600" height="396"/>\n\t\t\t\t\n\t\t\t</figure>\n\t\t<p>Sterling was last trading at $1.3589 after earlier hitting a day high of $1.3615 — this 1.4 per cent advance leaves sterling up about 3 per cent against the dollar on the week week, which began with stronger than expected inflation figures. </p><p>The currency also powered higher against the euro, rising 1.1 per cent and was trading at just under 88p versus the euro.</p><p>Although the MPC voted 7-2 to hold rates yesterday, the commentary accompanying the decision — and Mr Vlieghe’s speech today — is convincing more investors that after talking about lifting rates earlier in the year, the MPC is now more serious about doing so. </p><p>“The possibility of a November or February hike is real, we think,” analysts at Bank of America Merrill Lynch noted. “That said, we cannot understand why the BoE would want to hike rates just as currency effects on inflation are about to fade while domestic price pressure is non-existent. They seem to be panicking about the inflation peak rather than looking ahead to the likely sharp drop next year.”</p>\n\t\t\t<aside class="n-content-recommended" role="complementary" data-editorial-component-id="component1">\n\t\t\t\t<h2 class="n-content-recommended__title">Recommended</h2>\n\t\t\t\t\n\t\t\t\t<ul><li><a href="/content/de3e1832-97cc-11e7-b83c-9588e51488a0">Will UK economy be turbocharged by sterling fall</a>?</li><li><a href="/content/d43c7982-97d1-11e7-b83c-9588e51488a0">The Bank of England’s bark is loud but it has no bite</a></li><li><a href="/content/6a21c3e0-995c-11e7-a652-cde3f882dd7b">Bank of England’s interest rate rhetoric divides opinion</a></li></ul>\n\t\t\t</aside>\n\t\t<p>Before Mr Vlieghe’s speech on Friday morning, currency analysts had thought the pound was heading to $1.35 sooner than expected, given the increasingly hawkish BoE slant and its concerns about rising inflation. Yet some have <a href="/content/6a21c3e0-995c-11e7-a652-cde3f882dd7b">reservations</a> about the shift from the bank.</p><p>Mr Vlieghe acknowledged that inflation may ease back, and that uncertainty over the outcome of the Brexit negotiations may have “a larger impact on the economy than we have seen so far”.</p><p>David Meier, an economist at Julius Baer, said he was sceptical about the shift in BoE tone, saying it was “deliberately set to stabilise further the pound sterling”.</p><p>The currency’s weakness has been a strong driver of inflation and the pound’s renewed strength “will limit the inflation overshoot”.</p><p>While strategists at Nomura now believe the BoE will raise rates in November, Mr Rochester said there remained “many doubters” in the market. But added that the notion the idea of the BoE turning hawkish to support the currency and rate markets was a conspiracy theory.</p><p>“The BoE have had a continually evolving narrative towards hiking all year and now are at the brink of action,” said Mr Rochester.</p>'
			);
		});
	});

	describe('getXMLFile', function () {
		it('returns Buffer instance', function () {
			expect(documentBuilder.getXMLFile().constructor.name).to.equal(
				'Buffer'
			);
		});
	});
});
