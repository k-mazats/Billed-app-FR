import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { ROUTES, ROUTES_PATH } from '../constants/routes';

import { localStorageMock } from '../__mocks__/localStorage.js';
import router from '../__mocks__/router.js';
import firebase from '../__mocks__/firebase.js';

import NewBillUI from '../views/NewBillUI.js';

import NewBill from '../containers/NewBill.js';

describe('Given I am connected as an employee', () => {
	describe('When I am on NewBill Page', () => {
		test('Then new bill icon in vertical layout should be highlighted', () => {
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			let root = document.createElement('div');
			root.setAttribute('id', 'root');
			window.location.assign(ROUTES_PATH['NewBill']);
			document.body.appendChild(root);
			router();
			const billsIcon = screen.getByTestId('icon-mail');
			expect(billsIcon.classList.contains('active-icon')).toBeTruthy();
		});
		describe('When I select a file through the file input', () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			const firestore = {
				storage: {
					ref: jest.fn(() => {
						return {
							put: jest
								.fn()
								.mockResolvedValueOnce({ ref: { getDownloadURL: jest.fn() } }),
						};
					}),
				},
			};

			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const fileInput = document.querySelector(`input[data-testid="file"]`);
			const container = new NewBill({
				document,
				onNavigate,
				firestore,
				localStorage: window.localStorage,
			});
			const fileChange = jest.fn(container.handleChangeFile);
			fileInput.addEventListener('change', (e) => {
				fileChange(e);
			});
			describe('If the file is a jpg or png image', () => {
				test("Then the visual cue to indicate the wrong input shouldn't be displayed and the file should be uploaded", () => {
					const file = new File(['hello'], 'hello.png', { type: 'image/png' });
					fileInput.classList.add('is-invalid');
					userEvent.upload(fileInput, file);
					expect(fileChange).toHaveBeenCalled();
					expect(fileInput.files[0]).toStrictEqual(file);
					expect(fileInput.files.item(0)).toStrictEqual(file);
					expect(fileInput.files).toHaveLength(1);
					expect(fileInput.classList.contains('is-invalid')).toBeFalsy();
				});
			});
			describe('If the file is not a jpg or png image', () => {
				test('Then the visual cue to indicate the wrong input shouldn be displayed and the file should not be uploaded', () => {
					const file = new File(['hello'], 'hello.bmp', { type: 'image/bmp' });
					userEvent.upload(fileInput, file);
					expect(fileChange).toHaveBeenCalled();
					expect(fileInput.files[0]).toStrictEqual(file);
					expect(fileInput.files.item(0)).toStrictEqual(file);
					expect(fileInput.files).toHaveLength(1);
					expect(fileInput.classList.contains('is-invalid')).toBeTruthy();
				});
			});
		});
		describe('When I submit the new bill form', () => {
			test('Then the handleSubmit method should be called', () => {
				const html = NewBillUI();
				const testUser = {
					type: 'Employee',
					email: 'test@test.com',
				};
				window.localStorage.setItem('user', JSON.stringify(testUser));
				document.body.innerHTML = html;
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname });
				};
				const newBill = new NewBill({
					document,
					onNavigate,
					firestore: null,
					localStorage: window.localStorage,
				});
				const form = document.querySelector(
					`form[data-testid="form-new-bill"]`
				);
				const handleSubmitSpy = jest.spyOn(newBill, 'handleSubmit');
				form.addEventListener('submit', handleSubmitSpy);
				fireEvent.submit(form);
				expect(handleSubmitSpy).toHaveBeenCalled();
			});
			describe('If the file is valid', () => {
				test('Then the createBill method should be called', () => {
					const html = NewBillUI();
					const testUser = {
						type: 'Employee',
						email: 'test@test.com',
					};
					window.localStorage.setItem('user', JSON.stringify(testUser));
					document.body.innerHTML = html;
					const onNavigate = (pathname) => {
						document.body.innerHTML = ROUTES({ pathname });
					};
					const newBill = new NewBill({
						document,
						onNavigate,
						firestore: null,
						localStorage: window.localStorage,
					});
					const form = document.querySelector(
						`form[data-testid="form-new-bill"]`
					);
					const createBillSpy = jest.spyOn(newBill, 'createBill');
					newBill.fileName = 'test';
					fireEvent.submit(form);
					expect(createBillSpy).toHaveBeenCalled();
				});
			});
			describe('If the file is not valid', () => {
				test('Then the createBill method should not be called', () => {
					const html = NewBillUI();
					const testUser = {
						type: 'Employee',
						email: 'test@test.com',
					};
					window.localStorage.setItem('user', JSON.stringify(testUser));
					document.body.innerHTML = html;
					const onNavigate = (pathname) => {
						document.body.innerHTML = ROUTES({ pathname });
					};
					const newBill = new NewBill({
						document,
						onNavigate,
						firestore: null,
						localStorage: window.localStorage,
					});
					const form = document.querySelector(
						`form[data-testid="form-new-bill"]`
					);
					const createBillSpy = jest.spyOn(newBill, 'createBill');
					newBill.fileName = null;
					fireEvent.submit(form);
					expect(createBillSpy).not.toHaveBeenCalled();
				});
			});
		});
		describe('When I post a bill', () => {
			test('Number of bills fetched should be increased of 1', async () => {
				const postSpy = jest.spyOn(firebase, 'post');
				const newBillForTest = {
					id: 'M5fRN4WU0dv15Yeqlqqe',
					vat: '80',
					amount: 50,
					name: 'test integration post',
					fileName: 'bill.png',
					commentary: 'note de frais pour test',
					pct: 20,
					type: 'Transports',
					email: 'test@post.com',
					fileUrl: 'https://via.placeholder.com/140x140',
					date: '2020-09-11',
					status: 'pending',
					commentAdmin: 'test',
				};
				const allBills = await firebase.post(newBillForTest);
				expect(postSpy).toHaveBeenCalledTimes(1);
				expect(allBills.data.length).toBe(5);
			});
		});
	});
});
