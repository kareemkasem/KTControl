const employeeList = document.querySelector(".employee-list");
const addNewEmployee = document.querySelector("#add-new-employee");
const employee = document.querySelector("#employee");
const deleteEmployeeModal = document.querySelector("#delete-employee-modal");
const deleteEmployeeButton = document.querySelector("#delete-employee-button");
const confirmDeleteEmployeeButton = document.querySelector("#confirm-delete-employee-button");
const cancelDeleteEmployeeButton = document.querySelector("#cancel-delete-employee-button");

if (employeeList)
	employeeList.addEventListener("click", (e) => {
		if (e.target.className === "employee-details") {
			const id = e.target.id;
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
		// ! note: When you use fetch with the delete method, it doesn’t automatically follow redirects. The server response is received and processed by the browser, but your JavaScript code doesn’t get the redirected page content. that's why you HAVE TO redirect using the fronend
	});

if (cancelDeleteEmployeeButton)
	cancelDeleteEmployeeButton.addEventListener("click", () => {
		deleteEmployeeModal.style.display = "none";
	});
