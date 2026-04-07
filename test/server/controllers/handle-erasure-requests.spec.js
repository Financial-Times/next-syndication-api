'use strict';

const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const mockDeleteUserSubjectData = {
	delete_user_subject_data: {
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
			user_id: 'mock-user-uuid',
		},
	},
};

describe('handle-erasure-requests.spec.js', function () {

	let deleteUserSubjectData;
	let getUser;
	let req;
	let res;
	let handleErasureRequest;

	beforeEach(function () {
		getUser = sinon.stub().resolves([{ user_id: 'mock-user-id' }]);
		deleteUserSubjectData = sinon.stub().resolves([mockDeleteUserSubjectData]);

		handleErasureRequest = proxyquire('../../../server/controllers/handle-erasure-request', {
			'../lib/logger': {
				Logger: class Logger {
					info () {}
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
						delete_user_subject_data: deleteUserSubjectData,
						get_user: getUser,
					},
				},
				userUuid: 'mock-user-uuid',
			},
			status: sinon.stub(),
		};

		res.status.returns(res);
	});

	describe('success', function () {
		describe('with valid uuid', function () {
			it('returns the erasure result from the database with a 200 response', async function () {
				await handleErasureRequest(req, res);

				expect(getUser).to.have.been.calledOnceWithExactly(['mock-user-uuid']);
				expect(deleteUserSubjectData).to.have.been.calledOnceWithExactly(['mock-user-id']);
				expect(res.status).to.have.been.calledOnceWithExactly(200);
				expect(res.json).to.have.been.calledOnceWithExactly(mockDeleteUserSubjectData.delete_user_subject_data.data);
			});
		});

		describe('with valid email', function () {
			it('returns the erasure result from the database with a 200 response', async function () {
				req.body = {
					email: 'mock-email',
				};
				await handleErasureRequest(req, res);

				expect(getUser).to.have.been.calledOnceWithExactly(['mock-email']);
				expect(deleteUserSubjectData).to.have.been.calledOnceWithExactly(['mock-user-id']);
				expect(res.status).to.have.been.calledOnceWithExactly(200);
				expect(res.json).to.have.been.calledOnceWithExactly(mockDeleteUserSubjectData.delete_user_subject_data.data);
			});
		});
	});

	describe('failure', function () {
		describe('when no identifier is provided', function () {
			it('returns a 400 response with an error message', async function () {
				req.body = {};
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(400);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_MISSING_USER_IDENTIFIER',
					error: 'Missing user identifier. Either uuid or email must be provided.',
				});
			});
		});

		describe('when get_user throws an error', function () {
			it('returns a 500 response with an error message', async function () {
				getUser.rejects(new Error('Database error'));
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(500);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_FAILED_TO_GET_USER_DATA',
					error: 'Failed to retrieve user data from the database.',
				});
			});
		});

		describe('when delete_user_subject_data throws an error', function () {
			it('returns a 500 response with an error message', async function () {
				deleteUserSubjectData.rejects(new Error('Database error'));
				await handleErasureRequest(req, res);

				expect(res.status).to.have.been.calledOnceWithExactly(500);
				expect(res.json).to.have.been.calledOnceWithExactly({
					code: 'ERASURE_REQUEST_FAILED_TO_ERASE_USER_DATA',
					error: 'Failed to erase user data from the database.',
				});
			});
		});
	});
});
