items_url = "http://localhost:3000/items"
categories_url = "http://localhost:3000/categories"
const allItemsArray = []
// const allCategoriesArray = []
let outfits_url = "http://localhost:3000/outfits"
let outfit_items_url = "http://localhost:3000/outfit_items" 

document.addEventListener("DOMContentLoaded", () => {
    console.log("%cPage Loaded!", "color:green;")   
    // fetchOutfits()    
    const navBarOutfits = document.getElementById("nav-bar-outfits")
    navBarOutfits.addEventListener("click", () => {
        console.log("working")
        clearShowDiv()
        fetchOutfits()
    })

    
    const navBarClothes = document.getElementById("nav-bar-clothes")
    navBarClothes.addEventListener("click", () => {
        // const navBarClothesSpan = document.getElementById("nav-bar-clothes-span")
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
    console.log(item)   
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
        console.log(item)
        clearShowDiv()
        makeItem(item) 
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
    // console.log(outfit) 
    let outfitList = document.getElementById("item-container")
    // this was Jacobs but im trying something above 
    // let outfitList = document.getElementById("show-item") 
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

    outfitImg.addEventListener("click", () => {
        clearShowDiv()
        showOutfit(outfit)
    })

    
    outfitList.appendChild(outfitImg)  
    outfitList.appendChild(outfitSpan)
    outfitList.appendChild(wornOutfit)
    outfitList.appendChild(favoriteOutfit)   
}


const makeItem = (item) => {
    console.log(item)
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

const showOutfit = outfit => {
    clearShowDiv()
    const container = document.getElementById("item-container")
    const outFitDiv = document.createElement("div")
    const h2 = document.createElement('h2')
    h2.innerText = outfit.name 
    outFitDiv.appendChild(h2)
    const editOutfitbutton = document.createElement('button')
    editOutfitbutton.innerText = 'Edit Outfit'
    outFitDiv.appendChild(editOutfitbutton)
    editOutfitbutton.addEventListener("click", () => {
        displayEditOutfitForm(outfit)
        editOutfit(outfit)
        console.log(outfit)
    })
    const deleteOutfitButton = document.createElement("button")
    container.appendChild(deleteOutfitButton)
    deleteOutfitButton.innerText = "Delete Outfit"
    deleteOutfitButton.addEventListener("click", () => {
        deleteOutfit(outfit)
        outFitDiv.remove()
    })
    
    outfit.items.forEach(item => {
        const itemDiv = document.createElement("div")
        const img = document.createElement('img')
        itemDiv.innerText = item['name']
        img.src = item.image_url 
        const removeButton = document.createElement("button")
        removeButton.innerText = "Remove from Outfit"
        removeButton.addEventListener("click", () => {
            removeItemFromOutfit(outfit, item)
            itemDiv.remove()
        })
        itemDiv.appendChild(img)
        itemDiv.appendChild(removeButton)
        outFitDiv.appendChild(itemDiv)
    })
    container.appendChild(outFitDiv)
}

const removeItemFromOutfit = (outfit, item) => {
    fetch("http://localhost:3000/outfit_items/1", {
        method: "DELETE",
        headers: {
            "Content_type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
           outfit: outfit.id,
           item: item.id
        })
    })
}

const deleteOutfit = outfit => {
    console.log(outfit)
    fetch(`http://localhost:3000/outfits/${outfit.id}`, {
        method: "DELETE"
    })
}

const displayEditOutfitForm = outfit => {
    const editFormDiv = document.getElementById('add-item')
    const editForm = document.getElementById("outfit-edit-form")
    editFormDiv.appendChild(editForm)
    editForm.style.display = ''
    editForm['name'].value = outfit.name
}

const editOutfit = outfit => {
    const editForm = document.getElementById('outfit-edit-form')
    editForm.addEventListener("submit", (e) => {
        e.preventDefault()
        editedOutfit = {
            name: e.target.name.value,
            id: outfit.id 
        }
        editForm.style.display = 'none'
        updateOutfit(editedOutfit)
    })
}

const updateOutfit = outfit => {
    fetch(`http://localhost:3000/outfits/${outfit.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(outfit)
    }).then(res => res.json()).then(json => showOutfit(json))
}