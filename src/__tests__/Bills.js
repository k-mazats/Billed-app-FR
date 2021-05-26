import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { ROUTES } from "../constants/routes";

import { localStorageMock } from "../__mocks__/localStorage.js";

import { bills } from "../fixtures/bills.js";

import firestore from "../app/Firestore.js";

import BillsUI from "../views/BillsUI.js";
import ErrorPage from "../views/ErrorPage.js";
import LoadingPage from "../views/LoadingPage.js";

import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
	beforeEach(() => {
		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
		});
		window.localStorage.setItem(
			"user",
			JSON.stringify({
				type: "Employee",
			})
		);
	});
	describe("When I am on Bills Page", () => {
		test("Then bill icon in vertical layout should be highlighted", () => {
			const html = BillsUI({ data: [] });
			document.body.innerHTML = html;
			//to-do write expect expression
		});
		test("Then bills should be ordered from earliest to latest", () => {
			const html = BillsUI({ data: bills });
			document.body.innerHTML = html;
			const dates = screen
				.getAllByText(
					/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
				)
				.map((a) => a.innerHTML);
			const antiChrono = (a, b) => (a < b ? 1 : -1);
			const datesSorted = [...dates].sort(antiChrono);
			expect(dates).toEqual(datesSorted);
		});
	});
	describe("When I am loading Bills Page", () => {
		test("Then I should land on a loading page", () => {
			const billsHtml = BillsUI({ data: [], loading: true });
			const loadingHtml = LoadingPage();
			expect(billsHtml.indexOf(loadingHtml) > -1).toBeTruthy();
		});
	});
	describe("When there is an error", () => {
		test("Then I should land on an error page", () => {
			const billsHtml = BillsUI({ data: [], loading: false, error: "Whoops!" });
			const errorHtml = ErrorPage("Whoops!");
			expect(billsHtml.indexOf(errorHtml) > -1).toBeTruthy();
		});
	});
	describe("When I click on new bill button", () => {
		test("Then I should go to the new bill form page", async () => {
			const html = BillsUI({ data: bills });
			document.body.innerHTML = html;
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const container = new Bills({
				document,
				onNavigate,
				firestore,
				localStorage: window.localStorage,
			});

			const formTrigger = jest.fn(container.handleClickNewBill);
			const button = screen.getByTestId("btn-new-bill");

			button.addEventListener("click", formTrigger);

			userEvent.click(button);
			expect(formTrigger).toHaveBeenCalled();
			expect(screen.getByTestId("form-new-bill") !== undefined).toBeTruthy();
		});
	});
	// describe("When I click on eye icon", () => {
	// 	test("Then it should open the bill modal with corresponding content", async () => {
	// 		const html = BillsUI({ data: bills });
	// 		document.body.innerHTML = html;
	// 		const onNavigate = (pathname) => {
	// 			document.body.innerHTML = ROUTES({ pathname });
	// 		};
	// 		const container = new Bills({
	// 			document,
	// 			onNavigate,
	// 			firestore,
	// 			localStorage: window.localStorage,
	// 		});
	// 		const iconEye = screen.getAllByTestId('icon-eye');
	// 		const eye = iconEye[0]
	// 		userEvent.click(eye)
	// 		console.log(eye.outerHTML)
	// 	});
	// });
});

// describe("When I click on eye icon", () => {
// 	test("Then a modal should open", () => {
// 		const html = BillsUI({ data: bills });
// 		document.body.innerHTML = html;
// 		const onNavigate = (pathname) => {
// 			document.body.innerHTML = ROUTES({ pathname });
// 		};
// 		const container = new Bills({
// 			document,
// 			onNavigate,
// 			firestore,
// 			localStorage: window.localStorage,
// 		});
// 		const modalTrigger = jest.fn();
// 		const modale = screen.getByTestId("modaleFile");
// 		const eye = document.querySelector(`div[data-testid="icon-eye"]`);
// 		eye.addEventListener("click", (e) => {
// 			container.handleClickIconEye(eye);
// 		});
// 		userEvent.click(eye);

// expect(modalTrigger).toHaveBeenCalled();

// expect(modale).toBeTruthy();
//
// This one pass the test but gives no coverage
//
// document.addEventListener("DOMContentLoaded", function () {
// eye.addEventListener("click", handleClickIconEye);
// userEvent.click(eye);
// expect(handleClickIconEye).toHaveBeenCalled();
// const modale = screen.getByTestId("modaleFile");
// expect(modale).toBeTruthy();
// })
//
// This one fail the test but gives coverage
//
// document.addEventListener("DOMContentLoaded", function () {
// eye.addEventListener("click", handleClickIconEye);
// });
// userEvent.click(eye);
// expect(handleClickIconEye).toHaveBeenCalled();
// const modale = screen.getByTestId("modaleFile");
// expect(modale).toBeTruthy();
//
// This one add coverage but fail the test and throw 2 errors :
// 		TypeError: $(...).modal is not a function
//		TypeError: icon.getAttribute is not a function
//
// });
//
// This one add coverage but fail the test and throw 2 errors :
// 		TypeError: $(...).modal is not a function
//		TypeError: icon.getAttribute is not a function
//
// describe("When I click on eye icon", () => {
// 	let container, eye, handleClickIconEye;
// 	beforeAll(() => {
// 		const html = BillsUI({ data: bills });
// 		document.body.innerHTML = html;
// 		const onNavigate = (pathname) => {
// 			document.body.innerHTML = ROUTES({ pathname });
// 		};
// 		container = new Bills({
// 			document,
// 			onNavigate,
// 			firestore,
// 			localStorage: window.localStorage,
// 		});
// 		eye = screen.getAllByTestId("icon-eye")[0];
// 		handleClickIconEye = jest.fn(container.handleClickIconEye);
// 		document.addEventListener("DOMContentLoaded", function () {
// 			eye.addEventListener("click", handleClickIconEye);
// 		});
// 	});
// 	test("Then a modal should open", () => {
// 		userEvent.click(eye);
// 		expect(handleClickIconEye).toHaveBeenCalled();
// 		const modale = screen.getByTestId("modaleFile");
// 		expect(modale).toBeTruthy();
// 	});
// });
// });
