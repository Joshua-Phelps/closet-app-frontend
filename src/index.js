items_url = "http://localhost:3000/items"

document.addEventListener("DOMContentLoaded", () => {
    console.log("PAGE LOADED")

    fetchItems()
})



const fetchItems = () => {
    fetch("http://localhost:3000/items")
    .then(resp => resp.json())
    .then(json => seperateItems(json))
    // .then(json => itemsArray(json))
}

const seperateItems = items => {
    items.forEach(item => appendItem(item) )
}


const appendItem = item => {
    const showDiv = document.getElementById("show-item")
    const itemDiv = makeItemCard(item)
    showDiv.appendChild(itemDiv)
}

const makeItemCard = item => {
    console.log(item)
    const itemDiv = document.createElement("div")
    itemDiv.className = "card" 

    const img = document.createElement("img")
    img.src = item.image_url 
    
    const h3 = document.createElement("h3")
    h3.innerText = item["name"]

    itemDiv.appendChild(h3)
    itemDiv.appendChild(img)

    return itemDiv
}



// const itemsArray = (itemsArray) => {
//     itemsArray.forEach(item => console.log(item))
//     // itemsArray.forEach(item => makeItem(item))
// }
