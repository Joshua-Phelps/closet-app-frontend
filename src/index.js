items_url = "http://localhost:3000/items"
categories_url = "http://localhost:3000/categories"
const allItemsArray = []
const allCategoriesArray = []

document.addEventListener("DOMContentLoaded", () => {
    console.log("PAGE LOADED")

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
    const showDiv = document.getElementById("show-item")
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
    items.forEach(item => appendToShowDiv(item) )
}


const appendToShowDiv = (item) => {
    const showDiv = document.getElementById("show-item")
    const itemDiv = makeItemCard(item)
    showDiv.appendChild(itemDiv)
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
            category_ids: checked 
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
    }).then(res => res.json()).then(json => console.log(json))
}




