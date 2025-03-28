const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.querySelector('#cart-sidebar');
const closeIcon = document.querySelector('.close-icon');
let noProduct = document.querySelector('.no-product');
let goToCartBtn = document.querySelector('#go-to-cart-btn');
let numberOfProducts = document.querySelector('.number-of-products');

const itemsPerPage = 10;
let currentPage = 1;
let totalPages = 1;
let pageGroupStart = 1;

const fetchData = async () => {
  try {
    const response = await fetch('https://api.hyperteknoloji.com.tr/products/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1NDEyMzk2OCwiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9.NuTJXFzyuGW8x7Sm1eueqdH9DwfJGCEe59MROfeNMoQ`
      }
    });
    const data = await response.json();
    displayProducts(data);
  } catch (error) {
    console.error(error);
  }
};
const displayProducts = (data, page = 1) => {
  const productsContainer = document.getElementById('products-container');
  const paginationContainer = document.getElementById('pagination-container');

  productsContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  totalPages = Math.ceil(data.data.length / itemsPerPage);

  if (data.data.length > 0) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productsToShow = data.data.slice(start, end);
    let pageGroupEnd = Math.min(pageGroupStart + 4, totalPages);

    productsToShow.forEach(product => {
      createProductCart(product, productsContainer)
    });

    if (pageGroupStart > 1) {
      createBtn('prev-btn', '<i class="fa-regular fa-circle-left"></i>', () => {
        pageGroupStart = Math.max(1, pageGroupStart - 5);
        displayProducts(data, pageGroupStart);
      }, paginationContainer);
    }

    for (let i = pageGroupStart; i <= pageGroupEnd; i++) {
      createBtn(`pagination-btn ${i === currentPage ? 'active' : ''}`, i, () => {
        currentPage = i;
        displayProducts(data, currentPage);
      }, paginationContainer);
    }

    if (pageGroupEnd < totalPages) {
      createBtn('next-btn', '<i class="fa-regular fa-circle-right"></i>', () => {
        pageGroupStart = Math.min(totalPages - 4, pageGroupStart + 5);
        displayProducts(data, pageGroupStart);
      }, paginationContainer);
    }
  } else {
    let content = `
      <div class="no-result">
        <h2>Oops, no results</h2>
      </div>
    `
    noResultComponent(content, productsContainer)
  }
};

const createProductCart = (product, parent) => {
  parent
  let ratingHTML = "";
  for (let i = 0; i < 5 || product.rating; i++) {
    ratingHTML += `<i class="fa-solid fa-star"></i>`;
  }
  const productElement = document.createElement('div');
  productElement.className = 'product-card';
  productElement.innerHTML = `
    <div class="product-image">
      <img src=${product?.productData.productMainImage} alt="Product-Image" loading="lazy">
      <div class="product-icons">
        <button class="cart-btn"><i class="fa-solid fa-cart-shopping"></i></button>
        <button class="like-btn"><i class="fa-regular fa-heart"></i></button>
        <button class="share-btn"><i class="fa-solid fa-share-nodes"></i></button>
      </div>
    </div>
    <div class="product-details">
      <h2 class="product-name">${product.productName.substring(0, 45)}...</h2>
      <div class="product-price">
        <span class="current-price">${product.salePrice}$</span>
      </div>
      <p class="product-description">${product?.productData.productInfo.substring(0, 70)}...<a class="view-more" href="#">daha</a></p>
      <div class="product-rating">${ratingHTML} <span class="rating-score">(${product.sorting})</span></div>
    </div>
  `;
  parent.appendChild(productElement);
}

const createBtn = (className, content, onClick, parent) => {
  const btn = document.createElement('button');
  btn.className = className;
  btn.innerHTML = content;
  if (onClick) btn.addEventListener('click', onClick);
  parent.appendChild(btn);
};

const noResultComponent = (content, parent) => {
  parent.innerHTML = content;
}
fetchData();