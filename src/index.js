items_url = "http://localhost:3000/items"
categories_url = "http://localhost:3000/categories"
const allItemsArray = []
// const allCategoriesArray = []
let outfits_url = "http://localhost:3000/outfits"
let outfit_items_url = "http://localhost:3000/outfit_items" 

document.addEventListener("DOMContentLoaded", () => {
    console.log("%cPage Loaded!", "color:green;")   
    
    const navBarOutfits = document.getElementById("nav-bar-outfits")
    navBarOutfits.addEventListener("mouseover", mouseOver)
    navBarOutfits.addEventListener("mouseout", mouseOut)

    navBarOutfits.addEventListener("click", () => {
        clearShowDiv()
        fetchOutfits()
    })
    
    const navBarClothes = document.getElementById("nav-bar-clothes")
    navBarClothes.addEventListener("mouseover", mouseOverToo)
    navBarClothes.addEventListener("mouseout", mouseOutToo) 
    
    navBarClothes.addEventListener("click", () => {
        const navBarClothesSpan = document.getElementById("nav-bar-clothes-span")
        clearShowDiv()
        fetchItems()
        getCategories()
        makeAddItemFormButton()
    })
})

let mouseOver = () => {
    document.getElementById("nav-bar-outfits").style.color = "aqua"
}

let mouseOut = () => {
    document.getElementById("nav-bar-outfits").style.color = "black" 
}

let mouseOverToo = () => {
    document.getElementById("nav-bar-clothes").style.color = "aqua"     
}

let mouseOutToo = () => {
    document.getElementById("nav-bar-clothes").style.color = "black" 
}

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
    const itemDiv = makeItemCard(item)
    showDiv.appendChild(itemDiv)
}

const makeItemCard = item => {
    //console.log(item)   
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
    //let outfitList = document.getElementById("show-item") 
    let outfitList = document.getElementById("item-container") 
    let outfitSpan = document.createElement("span")
    outfitSpan.textContent = `Outfit Name- ${outfit.name}`
    let outfitImg = document.createElement("img")
    //console.log(outfit.items) 
    //outfitImg.src = outfit.items[0].image_url  
    outfit.items.forEach(item => 
    outfitImg.src = item.image_url 
    )
            let wornOutfit = document.createElement("p") 
            outfit.items.forEach(item =>
            wornOutfit.textContent = `Worn ${item.times_worn} times` 
            )
                    let favoriteOutfit = document.createElement("p")
                    outfit.items.forEach(item =>
                    favoriteOutfit.textContent = `Favorite Outfit? (${item.favorite})`  
                    )
                        // let createdAt = document.createElement("p")
                        // outfit.items.forEach(item =>
                        // createdAt.textContent = `Created At ${item.created_at}`    
                        // )

    
    outfitList.appendChild(outfitImg)  
    outfitList.appendChild(outfitSpan)
    outfitList.appendChild(wornOutfit)
    outfitList.appendChild(favoriteOutfit)
    //outfitList.appendChild(createdAt)    
}



const itemsArray = (itemsArray) => {
    // itemsArray.forEach(item => console.log(item))
    itemsArray.forEach(item => makeItem(item))
}

const makeItem = (item) => {
    let showItem = document.getElementById("show-item")
    let itemDiv = document.getElementById("item-container")

    let img = document.createElement("img")
    img.classList.add("item-image")
    img.src = item.image_url

    let ul = document.createElement("ul")

    let nameLi = document.createElement("h2")
    nameLi.textContent = item.name

    let categoryLi = document.createElement("li")
    categoryLi.textContent = item.category

    let timesWornLi = document.createElement("li")
    timesWornLi.textContent = item.times_worn

    // iterate thru outfits array
    // let itemOutfitsLi = document.createElement("li")
    // itemOutfitsLi.textContent = item.outfit.name

    // favorite button


    // delete button
    let deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Remove from closet"
    deleteBtn.addEventListener("click", () => {
        itemDiv.remove()
    })
    
    showItem.appendChild(itemDiv)
    itemDiv.appendChild(img)
    itemDiv.appendChild(ul)
    itemDiv.appendChild(nameLi)
    itemDiv.appendChild(categoryLi)
    itemDiv.appendChild(timesWornLi)
    itemDiv.appendChild(deleteBtn)
    // itemDiv.appendChild(itemOutfitsLi)

    // console.log(item)
}

// add deleteItem() to 
// const deleteItem = (item) => {
//     fetch(`http://localhost:3000/items/${item}`, {
//         method: "DELETE"
//     })
// }
