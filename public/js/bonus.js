const listOfEntries = document.querySelectorAll(".bonus");
const deleteButtons = document.querySelectorAll(".delete-button");
const deleteModal = document.querySelector("#delete-entry-modal");
const confirmDeleteButton = document.querySelector(
	"#confirm-delete-entry-button"
);
const cancelDeleteButton = document.querySelector(
	"#cancel-delete-entry-button"
);

listOfEntries.forEach((element) => {
	element.addEventListener("mouseenter", () => {
		const button = element.lastElementChild;
		button.style.display = "block";
	});
	element.addEventListener("mouseleave", () => {
		const button = element.lastElementChild;
		button.style.display = "none";
	});
});

deleteButtons.forEach((button) => {
	button.addEventListener("click", () => {
		deleteModal.style.display = "flex";
		confirmDeleteButton.dataset.id = button.dataset.id;
	});
});

cancelDeleteButton.addEventListener("click", () => {
	deleteModal.style.display = "none";
	delete confirmDeleteButton.dataset.id;
});

confirmDeleteButton.addEventListener("click", async () => {
	const id = confirmDeleteButton.dataset.id;
	await fetch(window.origin + "/bonuses/" + id, { method: "delete" });
	location.reload();
});
