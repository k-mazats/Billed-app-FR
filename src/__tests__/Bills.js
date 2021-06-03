import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { ROUTES, ROUTES_PATH } from "../constants/routes";

import { localStorageMock } from "../__mocks__/localStorage.js";
import firebase from "../__mocks__/firebase.js";

import { bills } from "../fixtures/bills.js";

import firestore from "../app/Firestore.js";

import BillsUI from "../views/BillsUI.js";

import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
	beforeEach(() => {});
	describe("When I am on Bills Page", () => {
		test("Then bill icon in vertical layout should be highlighted", () => {
			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});
			Object.defineProperty(window, "firebase", {
				value: firebase,
			});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const router = () => {
				const rootDiv = document.getElementById("root");
				rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });
				if (window.location.hash === ROUTES_PATH["Bills"]) {
					rootDiv.innerHTML = ROUTES({
						pathname: window.location.hash,
						loading: true,
					});
					const divIcon1 = document.getElementById("layout-icon1");
					const divIcon2 = document.getElementById("layout-icon2");
					divIcon1.classList.add("active-icon");
					divIcon2.classList.remove("active-icon");
					const bills = new Bills({
						document,
						onNavigate,
						firestore,
						localStorage,
					});
				}
			};
			let root = document.createElement("div");
			root.setAttribute("id", "root");
			window.location.assign("#employee/bills");
			document.body.appendChild(root);
			router();
			const billsIcon = screen.getByTestId("icon-window");
			expect(billsIcon.classList.contains("active-icon")).toBeTruthy();
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
	describe("When I am on Bills page but it is loading", () => {
		test("Then I should land on a loading page", () => {
			const html = BillsUI({ data: [], loading: true });
			document.body.innerHTML = html;
			expect(screen.getAllByText("Loading...")).toBeTruthy();
		});
	});
	describe("When I am on Bills page but back-end send an error message", () => {
		test("Then I should land on an error page", () => {
			const html = BillsUI({ data: [], loading: false, error: "Whoops!" });
			document.body.innerHTML = html;
			expect(screen.getAllByText("Erreur")).toBeTruthy();
		});
	});
	describe("When I click on new bill button", () => {
		test("Then I should go to the new bill form page", () => {
			const html = BillsUI({ data: bills });
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			document.body.innerHTML = html;
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
	// 	test("Then it should open the bill modal with corresponding content", () => {
	// 		const html = BillsUI({ data: bills });
	// 		document.body.innerHTML = html;
	//
	// 		const container = new Bills({
	// 			document,
	// 			onNavigate,
	// 			firestore,
	// 			localStorage: window.localStorage,
	// 		});

	// 		const iconEye = screen.getAllByTestId("icon-eye");
	// 		const eye = iconEye[0];
	// 		const modaleTrigger = jest.fn(container.handleClickIconEye);
	// 		const modaleBootstrapFn = jest.fn(global.$.fn.modal);
	// 		eye.addEventListener("click", () => {
	// 			modaleTrigger(eye);
	// 		});
	// 		document.addEventListener("show", () => {
	// 			console.log("modale is working");
	// 		});
	// 		userEvent.click(eye);
	// 		expect(modaleTrigger).toHaveBeenCalled();
	// 		const modale = screen.getByTestId("modaleFile");
	// 		const billUrl = eye.getAttribute("data-bill-url").split("?")[0];
	// 		expect(modale.innerHTML.includes(billUrl)).toBeTruthy();
	// 		expect(modale).toBeTruthy();

	// 		console.log(global.$.fn.modal.toString());
	// 		expect(modaleBootstrapFn).toHaveBeenCalled();
	// 	});
	// });
});
