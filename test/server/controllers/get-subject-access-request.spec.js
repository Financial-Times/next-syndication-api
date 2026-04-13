'use strict';

const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const mockGetUserSubjectAccessDataSuccess = {
	get_user_subject_access_data: {
		data: {
			syndicationUserData: {
				user: {
					role: 'user',
					user_id: 'mock-user-id',
					email: 'mock-email@example.com',
					surname: 'mock-surname',
					first_name: 'mock-first-name',
				},
				contracts: [
					{
						owner: false,
						user_id: 'mock-user-id',
						contract_id: 'mock-contract-id',
					}
				],
				downloads: [
					{
						_id: 'mock-download-id-1',
						content_id: 'http://www.ft.com/thing/mock-content-id-1',
					},
					{
						_id: 'mock-download-id-2',
						content_id: 'http://www.ft.com/thing/mock-content-id-2',
					},
				],
				saved_items: [
					{
						_id: 'mock-saved-item-id-1',
						content_id: 'http://www.ft.com/thing/mock-content-id-3',
					},
					{
						_id: 'mock-saved-item-id-2',
						content_id: 'http://www.ft.com/thing/mock-content-id-4',
					},
				],
				save_history: [
					{
						_id: 'mock-save-history-id-1',
						content_id: 'http://www.ft.com/thing/mock-content-id-5',
					},
					{
						_id: 'mock-save-history-id-2',
						content_id: 'http://www.ft.com/thing/mock-content-id-6',
					},
				],
				download_history: [
					{
						_id: 'mock-download-history-id-1',
						content_id: 'http://www.ft.com/thing/mock-content-id-7',
					},
					{
						_id: 'mock-download-history-id-2',
						content_id: 'http://www.ft.com/thing/mock-content-id-8',
					},
				],
				unique_downloads: [
					{
						_id: 'mock-unique-download-id-1',
						content_id: 'http://www.ft.com/thing/mock-content-id-9',
					},
					{
						_id: 'mock-unique-download-id-2',
						content_id: 'http://www.ft.com/thing/mock-content-id-10',
					},
				],
				contract_data: [
					{
						assets: [
							{
								product: 'mock-product',
								asset_type: 'mock-asset-type',
								contract_id: 'mock-contract-id',
								content_type: 'mock-content-type',
							}
						],
						licence_id: 'mock-licence-id',
					}
				],
			}
		}
	}
};

const mockGetUserSubjectAccessDataNoResult = {
	get_user_subject_access_data: {
		data: {
			syndicationUserData: {
				user: null,
			}
		}
	}
};

describe('get-subject-access-request.spec.js', () => {
	let getUserSubjectAccessRequest;
	let req;
	let res;
	let getSubjectAccessRequest;

	beforeEach(() => {
		getUserSubjectAccessRequest = sinon.stub().resolves([mockGetUserSubjectAccessDataSuccess]);
		getSubjectAccessRequest = proxyquire('../../../server/controllers/get-subject-access-request', {
			'../lib/logger': {
				Logger: class {
					constructor() {}
					info() {}
					error() {}
				}
			},
		});

		req = {
			body: {
				uuid: 'mock-user-uuid',
			},
			method: 'POST',
		};

		res = {
			json: sinon.stub(),
			locals: {
				$DB: {
					syndication: {
						get_user_subject_access_data: getUserSubjectAccessRequest,
					},
				},
				userUuid: 'mock-user-uuid',
			},
			status: sinon.stub(),
			sendStatus: sinon.stub(),
		};

		res.status.returns(res);
	});

	describe('success', () => {
		describe('with valid uuid', () => {
			it('returns 200 with user subject access data', async () => {
				await getSubjectAccessRequest(req, res);

				expect(getUserSubjectAccessRequest).to.have.been.calledOnceWithExactly(['mock-user-uuid']);
				expect(res.status).to.have.been.calledWith(200);
				expect(res.json).to.have.been.calledOnceWithExactly(mockGetUserSubjectAccessDataSuccess.get_user_subject_access_data);
			});
		});

		describe('with valid email', () => {
			it('returns 200 with user subject access data', async () => {
				req.body = { email: 'mock-email@example.com' };
				await getSubjectAccessRequest(req, res);

				expect(getUserSubjectAccessRequest).to.have.been.calledOnceWithExactly(['mock-email@example.com']);
				expect(res.status).to.have.been.calledWith(200);
				expect(res.json).to.have.been.calledOnceWithExactly(mockGetUserSubjectAccessDataSuccess.get_user_subject_access_data);
			});
		});
	});

	describe('failure', () => {
		describe('when no identifier is provided', () => {
			it('returns 400 with error message', async () => {
				req.body = {};
				await getSubjectAccessRequest(req, res);

				expect(res.status).to.have.been.calledWith(400);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'SUBJECT_ACCESS_REQUEST_MISSING_USER_IDENTIFIER',
					error: 'Missing user identifier. Either uuid or email must be provided in the request\'s body.',
				});
			});
		});

		describe('when user not found', () => {
			it('returns 404', async () => {
				getUserSubjectAccessRequest.resolves([mockGetUserSubjectAccessDataNoResult]);
				await getSubjectAccessRequest(req, res);

				expect(res.sendStatus).to.have.been.calledWith(404);
			});
		});

		describe('when get_user_subject_access_data throws an error', () => {
			it('returns 500 with error message', async () => {
				getUserSubjectAccessRequest.rejects(new Error('Database error'));
				await getSubjectAccessRequest(req, res);

				expect(res.status).to.have.been.calledWith(500);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'SUBJECT_ACCESS_REQUEST_FAILED_TO_GET_USER_DATA',
					error: 'Failed to retrieve user data from the database.',
				});
			});
		});
	});
});
