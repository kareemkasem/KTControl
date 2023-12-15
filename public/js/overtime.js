const listOfEntries = document.querySelectorAll(".bonus")

function handleApproveOrDeleteEvent(event) {
    if (event.target.classList.contains("overtime-approve")) {
        fetch(window.origin + "/bonuses/approve/" + event.target.dataset.id, {method: "put"})
            .then(() => {
                event.target.parentNode.parentNode.remove()
            }).catch((error) => {
            console.log(error)
        })
    }
    if (event.target.classList.contains("overtime-delete")) {
        fetch(window.origin + "/bonuses/" + event.target.dataset.id, {method: "delete"})
            .then(() => {
                event.target.parentNode.parentNode.remove()
            }).catch((error) => {
            console.log(error)
        })
    }
}

listOfEntries.forEach(entry => {
    entry.addEventListener("click", handleApproveOrDeleteEvent)
})