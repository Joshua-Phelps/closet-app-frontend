items_url = "http://localhost:3000/items"
categories_url = "http://localhost:3000/categories"
const allItemsArray = []
// const allCategoriesArray = []
let outfits_url = "http://localhost:3000/outfits"
let outfit_items_url = "http://localhost:3000/outfit_items" 

document.addEventListener("DOMContentLoaded", () => {
    console.log("%cPage Loaded!", "color:green;")   

    // fetchOutfits()

    const navBarClothes = document.getElementById("nav-bar-clothes")
    navBarClothes.addEventListener("click", () => {
        const navBarClothesSpan = document.getElementById("nav-bar-clothes-span")
        clearShowDiv()
        fetchItems()
        getCategories()
        makeAddItemFormButton()
    })
})

const clearShowDiv = () => {
    const showDiv = document.getElementById("item-container")
    while (showDiv.firstChild){
        showDiv.removeChild(showDiv.firstChild)
    }
}

const fetchItems = () => {
    fetch("http://localhost:3000/items")
    .then(resp => resp.json())
    .then(json => seperateItems(json))
}

const seperateItems = items => {
    items.forEach(item => appendItemToShowDiv(item) )
}


const appendItemToShowDiv = (item) => {
    const showDiv = document.getElementById("show-item")
    const container = document.getElementById("item-container")
    const itemDiv = makeItemCard(item)
    container.appendChild(itemDiv)
}

const makeItemCard = item => {
    // console.log(item)   
    allItemsArray.push(item)
    const itemDiv = document.createElement("div")
    itemDiv.className = "card" 
    itemDiv.style.display = ""
    itemDiv.classList.add("item-index")
    itemDiv.id = `item-${item.id}`

    const categoriesSpan = document.createElement("span")
    categoriesIdArray = item.categories.map(cat => `(${cat.id})`)
    categoriesSpan.innerText = `${categoriesIdArray}`
    categoriesSpan.id = `category-span-${item.id}`
    categoriesSpan.style.display = "none"

    const img = document.createElement("img")
    img.src = item.image_url 
    
    const h3 = document.createElement("h3")
    h3.innerText = item["name"]

    itemDiv.addEventListener("click", () => {
        // this will remove items from showDiv and display this item 
        clearShowDiv()
        makeItem(item)
        // console.log(item)
    })

    itemDiv.appendChild(h3)
    itemDiv.appendChild(img)
    itemDiv.appendChild(categoriesSpan)

    return itemDiv
}

const getCategories = () => {
    fetch(categories_url)
    .then(res => res.json())
    .then(json => seperateCategories(json))
}

const seperateCategories = categories => {
    const categoriesDiv = document.getElementById("categories")
    while (categoriesDiv.firstChild){
        categoriesDiv.removeChild(categoriesDiv.firstChild)
    }
    const ul = document.createElement("ul")
    ul.id = "category-display-ul"
    categoriesDiv.appendChild(ul)

    const ul2 = document.createElement('ul')
    ul2.id ="category-display-form-ul"
    const addItemForm = document.getElementById("add-item-form")
    addItemForm.appendChild(ul2)

    categories.forEach(category => appendToCategoriesDiv(category))

    categories.forEach(category => {
        const li = document.createElement("li")
        const input = document.createElement("INPUT")
        input.setAttribute("type", "checkbox")
        input.name = category.id
        input.className = "checkbox-submit"
        li.innerText = category["name"]
        li.appendChild(input)
        ul2.appendChild(li)
    })
}

const appendToCategoriesDiv = (category)  => {
    const categoriesDiv = document.getElementById("categories")
    const liCategory= makeCategoriesCard(category)
    categoriesDiv.appendChild(liCategory)
}

const makeCategoriesCard = category => {
    const li = document.createElement("li")
    const input = document.createElement("INPUT")
    input.setAttribute("type", "checkbox")
    li.innerText = category["name"]
    input.id = `category-${category.id}` 
    input.addEventListener("change", (e) => {
        if (input.checked === true){
            allItemsArray.forEach(item => {
                const span = document.getElementById(`category-span-${item.id}`)
                const itemDiv = document.getElementById(`item-${item.id}`)
                if (!span.innerText.includes(`(${category.id})`)){
                    itemDiv.style.display = "none"
                } else 
                    itemDiv.style.display = ""
            })

        } else 
        allItemsArray.forEach(item => {
            const span = document.getElementById(`category-span-${item.id}`)
            const itemDiv = document.getElementById(`item-${item.id}`)
            if (span.innerText.includes(`(${category.id})`)){
                itemDiv.style.display = ""
            } else 
                itemDiv.style.display = ""
        })
    })
    li.appendChild(input)
    return li 
}

const makeAddItemFormButton = () => {
    const addFormDiv = document.getElementById("add-item") 
    const button = document.createElement("button")
    button.innerText = "Add Clothing"
    addFormDiv.appendChild(button)
    button.addEventListener("click", () => {
        button.style.display = "none"
        showAddItemForm()
    })
}


const showAddItemForm = () => {
    const form = document.getElementById("add-item-form")
    const addFormDiv = document.getElementById("add-item")
    addFormDiv.appendChild.form
    const submitButton = document.createElement("INPUT")
    submitButton.setAttribute("type", "submit")
    submitButton.innerText = "submit"
    form.appendChild(submitButton)
    form.style.display = ""
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        let checkboxes = Array.from(document.getElementsByClassName("checkbox-submit"))
        let checked = []
        checkboxes.forEach(checkbox => {
            if (checkbox.checked === true){
                console.log(checkbox['name'])
                checked.push(parseInt(checkbox['name']))
            } 
        })
        const newItem = {
            name: e.target["clothing-name"].value,
            image_url: e.target["image-url"].value,
            user_id: 1,
            category_ids: checked, 
            times_worn: 0,
            favortite: false
        } 
        addItemtoDB(newItem)
    })
}

const addItemtoDB = item => {
    fetch(items_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(item)
    }).then(res => res.json()).then(json => appendItemToShowDiv(json))
}


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



// START AMY'S CODE
const itemsArray = (itemsArray) => {
    // itemsArray.forEach(item => console.log(item))
    itemsArray.forEach(item => makeItem(item))
}

const makeItem = (item) => {
    // let showItem = document.getElementById("show-item")
    let itemDiv = document.getElementById("item-container")

    let img = document.createElement("img")
    img.classList.add("item-image")
    img.src = item.image_url
    // console.log(item)

    let ul = document.createElement("ul")

    let nameLi = document.createElement("h2")
    nameLi.textContent = item.name

    let timesWornLi = document.createElement("li")
    timesWornLi.textContent = `Times Worn: ${item.times_worn}`

    let categoriesLi = document.createElement("li")
    categoriesLi.textContent = "Categories:"

    let itemCategoriesUl = document.createElement("ul")
    item.categories.forEach(outfit => {
        let itemCategoriesLi = document.createElement("li")
        itemCategoriesLi.textContent = outfit.name

        itemCategoriesUl.appendChild(itemCategoriesLi)
    })

    let outfitsLi = document.createElement("li")
    outfitsLi.textContent = "Outfits:"

    // iterate thru outfits array
    let itemOutfitsUl = document.createElement("ul")
    item.outfits.forEach(outfit => {
        let itemOutfitsLi = document.createElement("li")
        itemOutfitsLi.textContent = outfit.name

        itemOutfitsUl.appendChild(itemOutfitsLi)
    })
    
    // add to favorites (toggle heart button)
    let favItemBtn = document.createElement("button")
    favItemBtn.textContent = "Add to Favorites"
    favItemBtn.addEventListener("click", () => {
        // console.log(e)
    })

    // add to outfit button
    // drop down menu
    let addItemToOutfitBtn = document.createElement("button")
    addItemToOutfitBtn.textContent = "Add to Outfit"
    addItemToOutfitBtn.addEventListener("click", () => {
        // console.log(e)
    })

    // edit item button
    let editItemBtn = document.createElement("button")
    editItemBtn.textContent = "Edit Item"
    editItemBtn.addEventListener("click", () => {
        // console.log(e)
        // editItemForm(item) 
    })

    // delete item button
    let deleteItemBtn = document.createElement("button")
    deleteItemBtn.textContent = "Remove From Closet"
    deleteItemBtn.addEventListener("click", () => {
        itemDiv.remove()
    })
    
    // showItem.appendChild(itemDiv)
    itemDiv.appendChild(img)
    itemDiv.appendChild(ul)
    itemDiv.appendChild(nameLi)
    itemDiv.appendChild(timesWornLi)
    itemDiv.appendChild(categoriesLi)
    itemDiv.appendChild(itemCategoriesUl)
    itemDiv.appendChild(outfitsLi)
    itemDiv.appendChild(itemOutfitsUl)
    itemDiv.appendChild(favItemBtn)
    itemDiv.appendChild(addItemToOutfitBtn)
    itemDiv.appendChild(editItemBtn)
    itemDiv.appendChild(deleteItemBtn)

    // console.log(item)
}

// add deleteItem() to 
// const deleteItem = (item) => {
//     fetch(`http://localhost:3000/items/${item}`, {
//         method: "DELETE"
//     })
// }


// const editItemForm = (item) => {
//     let formDiv = document.getElementById("edit-item")

//     let editForm = document.getElementById("edit-form")
//     let editName = document.createElement("")
// }

// END AMY'S CODE
