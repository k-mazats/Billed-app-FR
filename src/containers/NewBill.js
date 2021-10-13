import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
	constructor({ document, onNavigate, firestore, localStorage }) {
		this.document = document;
		this.onNavigate = onNavigate;
		this.firestore = firestore;
		const formNewBill = this.document.querySelector(
			`form[data-testid="form-new-bill"]`
		);
		formNewBill.addEventListener('submit', this.handleSubmit);
		const file = this.document.querySelector(`input[data-testid="file"]`);
		file.addEventListener('change', this.handleChangeFile);
		this.fileUrl = null;
		this.fileName = null;
		new Logout({ document, localStorage, onNavigate });
	}
	handleChangeFile = (e) => {
		const file = this.document.querySelector(`input[data-testid="file"]`)
			.files[0];
		const fileExtension = file.name.split('.').pop();
		const validExtensions = ['jpg', 'jpeg', 'png'];

		if (validExtensions.includes(fileExtension)) {
			if (e.target.classList.contains('is-invalid')) {
				e.target.classList.remove('is-invalid');
			}
			this.firestore.storage
				.ref(`justificatifs/${file.name}`)
				.put(file)
				.then((snapshot) => snapshot.ref.getDownloadURL())
				.then((url) => {
					this.fileUrl = url;
					this.fileName = file.name;
				});
		} else {
			e.target.classList.add('is-invalid');
		}
	};
	handleSubmit = (e) => {
		e.preventDefault();
		const email = JSON.parse(localStorage.getItem('user')).email;
		const bill = {
			email,
			type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
			name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
			amount: parseInt(
				e.target.querySelector(`input[data-testid="amount"]`).value
			),
			date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
			vat: e.target.querySelector(`input[data-testid="vat"]`).value,
			pct:
				parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
				20,
			commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
				.value,
			fileUrl: this.fileUrl,
			fileName: this.fileName,
			status: 'pending',
		};
		if (this.fileName !== null) {
			this.createBill(bill);
			this.onNavigate(ROUTES_PATH['Bills']);
		}
	};

	// not need to cover this function by tests
	/* istanbul ignore next */
	createBill = (bill) => {
		if (this.firestore) {
			this.firestore
				.bills()
				.add(bill)
				.then(() => {
					this.onNavigate(ROUTES_PATH['Bills']);
				})
				.catch((error) => error);
		}
	};
}
