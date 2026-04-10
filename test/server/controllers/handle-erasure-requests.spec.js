'use strict';

const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const mockAnonymiseUserSubjectDataSuccess = {
	anonymise_user_subject_data: {
		data: {
			counts: {
				users: 1,
				downloads: 2,
				saved_items: 3,
				save_history: 4,
				contract_users: 1,
				download_history: 6,
				contract_unique_downloads: 7,
			},
			deleted: true,
			anonymised: true,
			original_user_id: 'mock-user-uuid',
			anonymised_user_id: 'gdpr-erased-anonymised-uuid'
		},
	},
};

const mockAnonymiseUserSubjectDataFailure = {
	anonymise_user_subject_data: {
		data: {
			counts: {
				users: 1,
				downloads: 2,
				saved_items: 3,
				save_history: 4,
				contract_users: 1,
				download_history: 6,
				contract_unique_downloads: 7,
			},
			deleted: false,
			anonymised: false,
			original_user_id: 'mock-user-uuid',
			reason: 'Mock failure reason',
		},
	},
};

describe('handle-erasure-requests.spec.js', () => {

	let anonymiseUserSubjectData;
	let getUser;
	let req;
	let res;
	let handleErasureRequest;

	beforeEach(() => {
		getUser = sinon.stub().resolves([{ user_id: 'mock-user-id' }]);
		anonymiseUserSubjectData = sinon.stub().resolves([mockAnonymiseUserSubjectDataSuccess]);

		handleErasureRequest = proxyquire('../../../server/controllers/handle-erasure-request', {
			'../lib/logger': {
				Logger: class Logger {
					info () {}
					warn () {}
					error () {}
				},
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
						anonymise_user_subject_data: anonymiseUserSubjectData,
						get_user: getUser,
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
			it('returns the erasure result from the database with a 200 response', async () => {
				await handleErasureRequest(req, res);

				expect(getUser).to.have.been.calledOnceWithExactly(['mock-user-uuid']);
				expect(anonymiseUserSubjectData).to.have.been.calledOnceWithExactly(['mock-user-id']);
				expect(res.status).to.have.been.calledOnceWithExactly(200);
				const { counts, anonymised_user_id } = mockAnonymiseUserSubjectDataSuccess.anonymise_user_subject_data.data;
				expect(res.json).to.have.been.calledOnceWithExactly({
					counts,
					anonymised_user_id,
				});
			});
		});

		describe('with valid email', () => {
			it('returns the erasure result from the database with a 200 response', async () => {
				req.body = {
					email: 'mock-email',
				};
				await handleErasureRequest(req, res);

				expect(getUser).to.have.been.calledOnceWithExactly(['mock-email']);
				expect(anonymiseUserSubjectData).to.have.been.calledOnceWithExactly(['mock-user-id']);
				expect(res.status).to.have.been.calledOnceWithExactly(200);
				const { counts, anonymised_user_id } = mockAnonymiseUserSubjectDataSuccess.anonymise_user_subject_data.data;
				expect(res.json).to.have.been.calledOnceWithExactly({
					counts,
					anonymised_user_id,
				});
			});
		});
	});

	describe('failure', () => {
		describe('when no identifier is provided', () => {
			it('returns a 400 response with error message', async () => {
				req.body = {};
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(400);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_MISSING_USER_IDENTIFIER',
					error: 'Missing user identifier. Either uuid or email must be provided.',
				});
			});
		});

		describe('when user is not found', () => {
			it('returns a 404 response', async () => {
				getUser.resolves([{}]);
				await handleErasureRequest(req, res);

				expect(res.sendStatus).to.have.been.calledOnceWithExactly(404);
			});
		});

		describe('when get_user throws an error', () => {
			it('returns a 500 response with correct error message', async () => {
				getUser.rejects(new Error('Database error'));
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(500);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_FAILED_TO_GET_USER_DATA',
					error: 'Failed to retrieve user data from the database.',
				});
			});
		});

		describe('when anonymise_user_subject_data throws an error', () => {
			it('returns a 500 response with correct error message', async () => {
				anonymiseUserSubjectData.rejects(new Error('Database error'));
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(500);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA',
					error: 'Failed to anonymise user data from the database.',
				});
			});
		});

		describe('when anonymise_user_subject_data returns a failure response', () => {
			it('returns a 500 response with correct error message and details', async () => {
				anonymiseUserSubjectData.resolves([mockAnonymiseUserSubjectDataFailure]);
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(500);
				const { counts, original_user_id, reason } = mockAnonymiseUserSubjectDataFailure.anonymise_user_subject_data.data;
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_FAILED_TO_ANONYMISE_USER_DATA',
					error: reason,
					counts,
					original_user_id,
				});
			});
		});
	});
});
