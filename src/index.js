items_url = "http://localhost:3000/items"

document.addEventListener("DOMContentLoaded", () => {
    console.log("PAGE LOADED")

    fetchItems()
})

const fetchItems = () => {
    fetch("http://localhost:3000/items")
    .then(resp => resp.json())
    .then(json => console.log(json))
    // .then(json => itemsArray(json))
}

// const itemsArray = (itemsArray) => {
//     itemsArray.forEach(item => console.log(item))
//     // itemsArray.forEach(item => makeItem(item))
// }