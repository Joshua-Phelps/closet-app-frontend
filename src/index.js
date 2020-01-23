let items_url = "http://localhost:3000/items"
let outfits_url = "http://localhost:3000/outfits"
let outfit_items_url = "http://localhost:3000/outfit_items" 

document.addEventListener("DOMContentLoaded", () => {
    console.log("%cPage Loaded!", "color:green;")   

    //fetchItems()
    fetchOutfits()
})

// const fetchItems = () => {
//     fetch("http://localhost:3000/items")
//     .then(resp => resp.json())
//     .then(json => console.log(json))
//     // .then(json => itemsArray(json))
// }

// const itemsArray = (itemsArray) => {
//     itemsArray.forEach(item => console.log(item))
//     // itemsArray.forEach(item => makeItem(item))
// }

const fetchOutfits = () => {
    fetch(outfits_url)   
    .then(resp => resp.json())
    //.then(json => console.log(json))
    .then(json => outfitItemsArray(json))
}

const outfitItemsArray = (outfitItemsArray) => {
    //outfitsArray.forEach(outfit => console.log(outfit)) 
    outfitItemsArray.forEach(outfit => displayOutfit(outfit)) 
}

const displayOutfit = outfit => {
    console.log(outfit) 
    let outfitList = document.getElementById("show-item") 
    let outfitSpan = document.createElement("span")
    outfitSpan.textContent = outfit.name
    let outfitImg = document.createElement("img")
    //console.log(outfit.items) 
    outfit.items.forEach(item => 
        outfitImg.src = item.image_url 
        )
  //outfitImg.src = outfit.items[0].image_url  
    let wornOutfit = document.createElement("p") 
    outfit.items.forEach(item =>
        wornOutfit.textContent = item.times_worn 
        )

        let favoriteOutfit = document.createElement("p")
        outfit.items.forEach(item =>
           favoriteOutfit.textContent = item.favorite  
        )

    
    outfitList.appendChild(outfitImg)  
    outfitList.appendChild(outfitSpan)
    outfitList.appendChild(wornOutfit)
    outfitList.appendChild(favoriteOutfit)   
}


