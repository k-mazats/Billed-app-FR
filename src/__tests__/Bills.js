import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import ErrorPage from "../views/ErrorPage.js";
import LoadingPage from "../views/LoadingPage.js";

describe("Given I am connected as an employee", () => {
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
});
