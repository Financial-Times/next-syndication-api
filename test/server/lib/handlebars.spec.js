'use strict';

const { expect } = require('chai');
const Handlebars = require('../../../server/lib/handlebars')();

describe('Handlebars with extended helper', function () {
    it('Should register an ifEquals helper', function () {
        expect(Handlebars.helpers).to.haveOwnProperty('ifEquals');
    });

    it('should render a template using ifEquals helper', function () {
        const template = Handlebars.compile('{{#ifEquals thing1 "thing1"}}first{{else}}not first{{/ifEquals}} {{#ifEquals thing1 "thing2"}}second{{else}}not second{{/ifEquals}}');
        const rendered = template({thing1: 'thing1', thing2: 'thing2'});
        expect(rendered).to.eql('first not second')
	});
});
