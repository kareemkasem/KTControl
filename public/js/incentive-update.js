const detailsPageLoadingButton = document.querySelector("#details-load-button");
const detailsPageIncentiveItemsList = document.querySelector(
	"#details-incentive-items-list"
);
const detailsPageIncentiveItems = document.querySelectorAll(
	".details-incentive-item"
);
const submitButton = document.querySelector("#submit-button");
const employee = document.querySelector("#employee");
const month = document.querySelector("#month");

detailsPageLoadingButton.addEventListener("click", async (e) => {
	const response = await fetch(
		window.origin +
			"/incentive/details/update?" +
			new URLSearchParams({
				employee: employee.value,
				month: month.value.split("-").reverse().join("/"),
			})
	);

	const data = await response.json();
	if (data.length > 0) {
		detailsPageIncentiveItems.forEach((item) => {
			const name = item.querySelector("input[type=text]");
			data.forEach((dataItem) => {
				if (dataItem.name === name.value)
					item.querySelector("input[name=quantities]").value =
						dataItem.quantity;
			});
		});
	}
	detailsPageIncentiveItemsList.style.display = "flex";
	detailsPageLoadingButton.style.display = "none";
	submitButton.style.display = "block";
});
