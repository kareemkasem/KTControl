const incentiveDetailsFilters = document.getElementsByName("filter");
const monthFilter = document.querySelector("#month-filter");
const employeeFilter = document.querySelector("#employee-filter");
const filterSearchButton = document.querySelector("#filter-search-button");
const filterSearchResult = document.querySelector("#filter-search-result");

const state = {
    filter: "employee",
};

const updateState = (newState) => {
    state.filter = newState;
    updateElementState();
};

function updateElementState() {
    switch (state.filter) {
        case "employee":
            employeeFilter.style.display = "flex";
            monthFilter.style.display = "none";
            break;

        case "month":
            employeeFilter.style.display = "none";
            monthFilter.style.display = "flex";
            break;

        default:
            break;
    }
}

function updateResultELementState(input) {
    if (state.filter === "employee") {
        const dataMarkup = input.data
            .map((i) => {
                const itemsMarkup = i.items
                    .map(
                        (item) => `
            <div class="incentive-item incentive-details-item">
                <p><span class="incentive-item-detail">Name: </span>${
                            item.name
                        }</p>
                <p><span class="incentive-item-detail">Price: </span>${
                            item.price
                        }</p>
                <p><span class="incentive-item-detail">Incentive: </span>${
                            item.incentive
                        }</p>
                <p><span class="incentive-item-detail">Quantity: </span>${
                            item.quantity
                        }</p>
                <p><span class="incentive-item-detail">Total: </span>${
                            item.total
                        }</p>
                <p><span class="incentive-item-detail">Valid Till: </span>${new Date(
                            item.validTill
                        ).toDateString()}</p>
            </div>
            `
                    )
                    .join("");
                return `
                <h2 class="header">${i.month}</h2>
                ${itemsMarkup}
            `;
            })
            .join("");

        filterSearchResult.innerHTML = `
        <div class="incentive-details-employee">
        <h1 class="detail-title">
            ${input.employee.name}
        </h1>
        <p>
            <span class="detail-title">Job Title:</span> ${input.employee.title}
        </p>
        <p>
            <span class="detail-title">Code:</span> ${input.employee.code}
        </p>
        <p>
            <span class="detail-title">Hourly Rate:</span> ${input.employee.hourlyRate}
        </p>
    </div>
    <hr>
    ${dataMarkup}
        `;
    }

    if (state.filter === "month") {
        const markup = input
            .map((entry) => {
                console.log(entry);
                const itemsMarkup = entry.items
                    .map(
                        (item) => `
            <div class="incentive-item incentive-details-item">
                <p><span class="incentive-item-detail">Name: </span>${
                            item.name
                        }</p>
                <p><span class="incentive-item-detail">Price: </span>${
                            item.price
                        }</p>
                <p><span class="incentive-item-detail">Incentive: </span>${
                            item.incentive
                        }</p>
                <p><span class="incentive-item-detail">Quantity: </span>${
                            item.quantity
                        }</p>
                <p><span class="incentive-item-detail">Total: </span>${
                            item.total
                        }</p>
                <p><span class="incentive-item-detail">Valid Till: </span>${new Date(
                            item.validTill
                        ).toDateString()}</p>
            </div>
            `
                    )
                    .join("");
                return `
			<h2 class="header">${entry.employee}</h2>
			${itemsMarkup}
			`;
            })
            .join("");
        filterSearchResult.innerHTML = markup;
    }
}

for (let i = 0; i < incentiveDetailsFilters.length; i++) {
    incentiveDetailsFilters[i].addEventListener("change", () => {
        if (incentiveDetailsFilters[i].checked) {
            updateState(incentiveDetailsFilters[i].value);
        }
    });
}

filterSearchButton.addEventListener("click", async () => {
    const result = await fetch(
        `${window.location.origin}/incentive/${state.filter}/${
            document.getElementById(state.filter).value
        }`
    ).then((res) => res.json());
    updateResultELementState(result);
});

updateElementState();
