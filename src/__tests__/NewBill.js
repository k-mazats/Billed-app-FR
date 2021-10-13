import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { ROUTES, ROUTES_PATH } from "../constants/routes";

import { localStorageMock } from "../__mocks__/localStorage.js";
import router from '../__mocks__/router.js';
import firebase from "../__mocks__/firebase.js";
import BillsUI from '../views/BillsUI.js';

import NewBillUI from "../views/NewBillUI.js";

import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		test("Then new bill icon in vertical layout should be highlighted", () => {
		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
		});
		window.localStorage.setItem(
			"user",
			JSON.stringify({
				type: "Employee",
			})
		);
		let root = document.createElement("div");
		root.setAttribute("id", "root");
		window.location.assign(ROUTES_PATH["NewBill"]);
		document.body.appendChild(root);
		router();
		const billsIcon = screen.getByTestId("icon-mail");
		expect(billsIcon.classList.contains("active-icon")).toBeTruthy();
		});
		describe("When I select a file through the file input", () => {
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
		// const fileChange = jest.fn(container.handleChangeFile);
		describe("If the file is a jpg or png image", () => {
			const file = new File(['hello'], 'hello.png', { type: 'image/png' });
			test('Then file should be uploaded', () => {
				// fileInput.addEventListener("change", (e) => {
				// 	fileChange(e);
				// });
				userEvent.upload(fileInput, file);
				// expect(fileChange).toHaveBeenCalled();
				expect(fileInput.files[0]).toStrictEqual(file);
				expect(fileInput.files.item(0)).toStrictEqual(file);
				expect(fileInput.files).toHaveLength(1);
				expect(fileInput.classList.contains('is-invalid')).toBeFalsy();
			});
			describe("If a previous attempt was made using wrong type of file", () => {
				fileInput.classList.add("is-invalid")
				test("Then the visual cue to indicate the wrong input shouldn't be displayed anymore", () => {
					// fileInput.addEventListener('change', (e) => {
					// 	fileChange(e);
					// });
					userEvent.upload(fileInput, file);
					// expect(fileChange).toHaveBeenCalled();
					expect(fileInput.files[0]).toStrictEqual(file);
					expect(fileInput.files.item(0)).toStrictEqual(file);
					expect(fileInput.files).toHaveLength(1);
					expect(fileInput.classList.contains('is-invalid')).toBeFalsy();
				})
			})
		});
		describe('If the file is not a jpg or png image', () => {
			const file = new File(['hello'], 'hello.bmp', { type: 'image/bmp' });
			test('Then file should not be uploaded', () => {
				// fileInput.addEventListener('change', (e) => {
				// 	fileChange(e);
				// });
				userEvent.upload(fileInput, file);

				expect(fileInput.files[0]).toStrictEqual(file);
				expect(fileInput.files.item(0)).toStrictEqual(file);
				expect(fileInput.files).toHaveLength(1);
				expect(fileInput.classList.contains('is-invalid')).toBeTruthy();
			});
		});
	});
	});
	describe('When I post a bill', () => {
		test('number of bills fetched should be increased of 1', async () => {
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

		test('fetches bills from an API and fails with 404 message error', async () => {
			firebase.post.mockImplementationOnce(() =>
				Promise.reject(new Error('Erreur 404'))
			);
			const html = BillsUI({ error: 'Erreur 404' });
			document.body.innerHTML = html;
			const message = await screen.getByText(/Erreur 404/);
			expect(message).toBeTruthy();
		});
		test('fetches messages from an API and fails with 500 message error', async () => {
			firebase.post.mockImplementationOnce(() =>
				Promise.reject(new Error('Erreur 500'))
			);
			const html = BillsUI({ error: 'Erreur 500' });
			document.body.innerHTML = html;
			const message = await screen.getByText(/Erreur 500/);
			expect(message).toBeTruthy();
		});
	});
});
