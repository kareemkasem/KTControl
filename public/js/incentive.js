const incentiveItemList = document.querySelector(".incentive-item-list");
const updateIncentiveItemModal = document.querySelector("#update-incentive-item-modal")

if (incentiveItemList)
    incentiveItemList.addEventListener("click", (event) => {
        if (event.target.dataset.id) {
            window.location.href = `${window.location.origin}/incentive/items/${event.target.dataset.id}`;
        }
    });