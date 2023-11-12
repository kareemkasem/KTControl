const url = document.URL;
const list = document.querySelector(".employee-list");
const addNewEmployee = document.querySelector("#add-new-employee");

function renderEmployeePage(id) {
	window.location.href = `${url}/${id}`;
}

function renderNewEmployeePage() {
	window.location.href = `${url}/new-employee`;
}

list.addEventListener("click", (e) => {
	if (e.target.className === "employee-details") {
		const id = e.target.id;
		renderEmployeePage(id);
	}
});

addNewEmployee.addEventListener("click", () => {
	renderNewEmployeePage();
});
