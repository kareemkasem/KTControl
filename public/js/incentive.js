const incentiveItemList = document.querySelector(".incentive-item-list");
const updateIncentiveItemModal = document.querySelector(
	"#update-incentive-item-modal"
);
const month = document.querySelector("#months");
const employee = document.querySelector("#employees");
const calculateTotalButton = document.querySelector("#calculate-total-button");
const calculationOutputField = document.querySelector("#output");

if (incentiveItemList)
	incentiveItemList.addEventListener("click", (event) => {
		if (event.target.dataset.id) {
			window.location.href = `${window.location.origin}/incentive/items/${event.target.dataset.id}`;
		}
	});

if (calculateTotalButton) {
	calculateTotalButton.addEventListener("click", async (event) => {
		const reqParams = {};
		if (employee.value && employee.value !== "Any") {
			reqParams.employee = employee.value;
		}
		if (employee.value && month.value !== "Any") {
			reqParams.month = month.value;
		}

		const response = await fetch(
			window.origin + `/incentive/total/data?` + new URLSearchParams(reqParams)
		);

		const { total } = await response.json();

		calculationOutputField.value = total;
	});
}
