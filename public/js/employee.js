const employeeList = document.querySelector(".employee-list");
const addNewEmployee = document.querySelector("#add-new-employee");
const employee = document.querySelector("#employee");
const deleteEmployeeModal = document.querySelector("#delete-employee-modal");
const deleteEmployeeButton = document.querySelector("#delete-employee-button");
const confirmDeleteEmployeeButton = document.querySelector("#confirm-delete-employee-button");
const cancelDeleteEmployeeButton = document.querySelector("#cancel-delete-employee-button");
const updateEmployeePasswordModal = document.querySelector("#update-employee-password-modal");
const changeEmployeePasswordButton = document.querySelector("#change-employee-password-button");
const cancelChangeEmployeePasswordButton = document.querySelector("#cancel-change-employee-password-button");

if (employeeList)
	employeeList.addEventListener("click", (e) => {
		const id = e.target.dataset.id;
		if (id) {
			window.location.href = `${window.location.origin}/employee/${id}`;
		}
	});

if (addNewEmployee)
	addNewEmployee.addEventListener("click", () => {
		window.location.href = `${window.location.origin}/employee/new-employee`;
	});

if (deleteEmployeeButton)
	deleteEmployeeButton.addEventListener("click", () => {
		deleteEmployeeModal.style.display = "flex";
	});

if (confirmDeleteEmployeeButton)
	confirmDeleteEmployeeButton.addEventListener("click", () => {
		const id = employee.dataset.id;
		fetch(`${window.location.origin}/employee/${id}`, { method: "delete" })
			.then(() => (window.location.href = `${window.location.origin}/employee`))
			.catch((e) => {
				throw new Error(e);
			});
		// ! note: When you use fetch with the delete method, it doesn’t automatically follow redirects. The server response is received and processed by the browser, but your JavaScript code doesn’t get the redirected page content. that's why you HAVE TO redirect using the frontend
	});

if (cancelDeleteEmployeeButton)
	cancelDeleteEmployeeButton.addEventListener("click", () => {
		deleteEmployeeModal.style.display = "none";
	});

if (changeEmployeePasswordButton)
	changeEmployeePasswordButton.addEventListener("click", () => {
		updateEmployeePasswordModal.style.display = "flex";
	});

if (cancelChangeEmployeePasswordButton)
	cancelChangeEmployeePasswordButton.addEventListener("click", (e) => {
		e.preventDefault(); // ! EVERY BUTTON SUBMITS THE FORM BY DEFAULT
		updateEmployeePasswordModal.style.display = "none";
	});
