let employee = document.getElementById("employee");
employee = Number(employee.value) || "all";
const month = document.getElementById("month").value;
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	window.location.href =
		window.origin + `/attendance/query/?employee=${employee}&month=${month}`;
});
