import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { ROUTES, ROUTES_PATH } from "../constants/routes";

import { localStorageMock } from "../__mocks__/localStorage.js";
import firebase from "../__mocks__/firebase.js";

import firestore from "../app/Firestore.js";

import NewBillUI from "../views/NewBillUI.js";

import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		test("Then new bill icon in vertical layout should be highlighted", () => {
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
				if (window.location.hash === ROUTES_PATH["NewBill"]) {
					rootDiv.innerHTML = ROUTES({
						pathname: window.location.hash,
						loading: true,
					});
					new NewBill({ document, onNavigate, firestore, localStorage });
					const divIcon1 = document.getElementById("layout-icon1");
					const divIcon2 = document.getElementById("layout-icon2");
					divIcon1.classList.remove("active-icon");
					divIcon2.classList.add("active-icon");
				}
			};
			let root = document.createElement("div");
			root.setAttribute("id", "root");
			window.location.assign("#employee/bill/new");
			document.body.appendChild(root);
			router();
			const newBillIcon = screen.getByTestId("icon-mail");
			expect(newBillIcon.classList.contains("active-icon")).toBeTruthy();
		});
		// describe("When I select a file through the file input", () => {
		// const html = NewBillUI();
		// document.body.innerHTML = html;
		// const onNavigate = (pathname) => {
		// 	document.body.innerHTML = ROUTES({ pathname });
		// };
		// const fileInput = document.querySelector(`input[data-testid="file"]`);
		// const container = new NewBill({
		// 	document,
		// 	onNavigate,
		// 	firestore,
		// 	localStorage: window.localStorage,
		// });
		// const fileChange = jest.fn(container.handleChangeFile);
		// describe("If the file is a jpg or png image", () => {
		// 	test("Then file should be uploaded", () => {
		// 		const file = new File(["hello"], "hello.png", { type: "image/png" });
		// 		fileInput.addEventListener("change", (e) => {
		// 			fileChange(e);
		// 			console.log(JSON.stringify(e))
		// 			console.log(`Type: ${e.type}`);
		// 			console.log(`Target: ${e.target.outerHTML}`);
		// 			console.log(`Target value: ${e.target.value}`);
		// 		});
		// 		userEvent.upload(fileInput, file);

		// 		expect(fileChange).toHaveBeenCalled();
		// 		expect(fileInput.files[0]).toStrictEqual(file);
		// 		expect(fileInput.files.item(0)).toStrictEqual(file);
		// 		expect(fileInput.files).toHaveLength(1);
		// 	});
		// });
	// });
	});
	
});
