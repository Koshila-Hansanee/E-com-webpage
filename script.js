var cart = [];
const productsPerPage = 8;
let currentPage = 1;
let products = []; // Store the fetched products in this variable



function addToCart(item) {
    cart.push(item);
    const cartItems = document.getElementById("cartItems");
    // let listItem = `<li id="list-item-${item.id}">${item.name} <i class="fa-solid fa-circle-xmark" onclick="removeCartItem(${item.id})"></i></li>`;
    let listItem = `
        <li style="display: flex; justify-content: space-between; " id="list-item-${item.id}">
            
                <div style="display: flex; ">
                
                    <h5 class="text-sm text-gray-500 font-bold tracking-widest mb-2 uppercase">${item.name}</h5>
                    <p>-$${item.price}</p>
                    <button href="#" onclick="removeCartItem('${item.id}')" style=" background-color: Transparent;
                    background-repeat:no-repeat;
                    border: none;
                    overflow: hidden;
                    outline:none;"><i class="fa-solid fa-circle-xmark"></i></button>
                    
                
                </div>
            
      </li>`;
    cartItems.innerHTML += listItem;
    updateTotalCostDisplay();
}

function removeCartItem(itemId) {
  const cartItems = document.getElementById("cartItems");
  let i = document.getElementById("list-item-" + itemId);
  cartItems.removeChild(i);
  
  const itemIndex = cart.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  updateTotalCostDisplay();
}

function extractUniqueCategories(products) {
  const categoriesSet = new Set();
  for (const product of products) {
    categoriesSet.add(product.category);
  }
  return Array.from(categoriesSet);
}

function extractUniqueBrands(products) {
  const brandsSet = new Set();
  for (const product of products) {
    brandsSet.add(product.brand);
  }
  return Array.from(brandsSet);
}

function loadProducts() {
  const categorySelect = document.getElementById("categorySelect");
  const selectedCategory = categorySelect.value;
  fetch("https://dummyjson.com/products")
    .then((response) => response.json())
    .then((json) => {
      products = json.products; 
      const uniqueCategories = extractUniqueCategories(products);
      const uniqueBrands = extractUniqueBrands(products);
      populateCategoryOptions(uniqueCategories);
      populateBrandOptions(uniqueBrands);
      if (selectedCategory !== "All") {
        filterProducts();
      }else{
        resetFilters();
      }

      //resetFilters();
      displayProductsByPage(currentPage);
      updateTotalCostDisplay();

      
    })
    .catch((error) => {
      console.log(error);
    });
}

function displayProductsByPage(page, productsToShow = products) {
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = productsToShow.slice(startIndex, endIndex);
  displayProducts(productsToDisplay);
}

function displayProducts(productsToShow) {
  const productsDiv = document.getElementById("product-container");
  productsDiv.innerHTML = "";
  for (const product of productsToShow) {
    const id = "product-" + uuid.v4();
    let productHtml = generateProductHtml(id, product);
    productsDiv.innerHTML += productHtml;
  }
}

function generateProductHtml(id, product) {
  return `<div id="${id}" class="card">
  <img src="${product.thumbnail}" alt="" class="imgStyle">
  <div class="product-details">
  <h6>${product.title}</h6>
  <div class="description1">${product.description}</div>
</div>

  <div class="text-lg text-black font-light">$${product.price}.00</div>
  <button onclick="addToCart({id:'${id}',name:'${product.title}',price:${product.price}})">Add to cart</button>
</div>`;
}

function calculateTotalCost() {
  let totalCost = 0;
  for (const item of cart) {
    totalCost += item.price;
  }
  return totalCost;
}

function updateTotalCostDisplay() {
  const totalCostDisplay = document.getElementById("totalCostDisplay");
  const totalCost = calculateTotalCost();
  totalCostDisplay.innerText = `$${totalCost.toFixed(2)}`;
}

function updateTotalCostDisplay() {
  const totalCostDisplay = document.getElementById("totalCostDisplay");
  const discountDisplay = document.getElementById("discountDisplay");
  const discountedTotalDisplay = document.getElementById("discountedTotalDisplay");
  
  const totalCost = calculateTotalCost();

  let discount = 0;
  let discountPercentage = "0%";
  if (totalCost >= 4000) {
    discount = 0.2; // 20% discount
    discountPercentage = "20%";
  } else if (totalCost >= 2000) {
    discount = 0.1; // 10% discount
    discountPercentage = "10%";
  }

  const discountedTotal = totalCost - (totalCost * discount);
  totalCostDisplay.innerText = `$${totalCost.toFixed(2)}`;
  discountDisplay.innerText = discountPercentage;
  discountedTotalDisplay.innerText = `$${discountedTotal.toFixed(2)}`;
}


function searchProducts() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  if (searchInput === "") {
    // If the search input is empty, display the products based on the current filters
    filterProducts();
  } else {
    const filteredProducts = products.filter((product) => {
      return product.title.toLowerCase().includes(searchInput) || product.description.toLowerCase().includes(searchInput);
    });
    displayProductsByPage(currentPage, filteredProducts);
  }
}

const prevPageButton = document.getElementById("prevPageButton");
const nextPageButton = document.getElementById("nextPageButton");
const searchInput = document.getElementById("searchInput");
const resetFiltersButton = document.getElementById("resetFiltersButton");

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProductsByPage(currentPage);
  }
});

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.ceil(products.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProductsByPage(currentPage);
  }
});

searchInput.addEventListener("input", () => {
  searchProducts();
});

resetFiltersButton.addEventListener("click", () => {
  resetFilters();
});

function filterProducts() {
  
  const categorySelect = document.getElementById("categorySelect");
  const selectedCategory = categorySelect.value;

  const brandSelect = document.getElementById("brandSelect");
  const selectedBrand = brandSelect.value;

  console.log("Selected Category:", selectedCategory);
  console.log("Selected Brand:", selectedBrand);

  let filteredProducts = products;

  if (selectedCategory !== "") {
    filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory);
  }

  if (selectedBrand !== "") {
    filteredProducts = filteredProducts.filter((product) => product.brand === selectedBrand);
  }

  console.log("Filtered Products:", filteredProducts);

  displayProductsByPage(1, filteredProducts); 
}

function resetFilters() {
  const categorySelect = document.getElementById("categorySelect");
  const brandSelect = document.getElementById("brandSelect");

  categorySelect.value = "All";
  brandSelect.value = "All";

  const filteredProducts = products;
  displayProductsByPage(1, filteredProducts);
}


function populateCategoryOptions(categories) {
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = ""; 
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
}

function populateBrandOptions(brands) {
  const brandSelect = document.getElementById("brandSelect");
  brandSelect.innerHTML = ""; 
  for (const brand of brands) {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  }
}

const categorySelect = document.getElementById("categorySelect");
const brandSelect = document.getElementById("brandSelect");

categorySelect.addEventListener("change", () => {
  
  filterProducts(); 
  
});


brandSelect.addEventListener("change", () => {
  
  filterProducts(); 
});



loadProducts();
