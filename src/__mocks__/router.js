import { ROUTES, ROUTES_PATH } from "../constants/routes.js";

export default () => {
	const rootDiv = document.getElementById("root");

  
	if (window.location.hash === ROUTES_PATH["Bills"]) {
		rootDiv.innerHTML = ROUTES({
			pathname: window.location.hash,
			loading: true,
		});
		const divIcon1 = document.getElementById("layout-icon1");
		const divIcon2 = document.getElementById("layout-icon2");
		divIcon1.classList.add("active-icon");
		divIcon2.classList.remove("active-icon");
	} else if (window.location.hash === ROUTES_PATH["NewBill"]) {
		rootDiv.innerHTML = ROUTES({
			pathname: window.location.hash,
			loading: true,
		});
		const divIcon1 = document.getElementById("layout-icon1");
		const divIcon2 = document.getElementById("layout-icon2");
		divIcon1.classList.remove("active-icon");
		divIcon2.classList.add("active-icon");
	}

	return null;
};
