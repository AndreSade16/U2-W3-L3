const cardsSpace = document.getElementById("cards-space");
const cartList = document.getElementById("cart-list");
const buyBtn = document.getElementById("buy-btn");
const totalDisplay = document.getElementById("total-display");
const cartItemsBadge = document.getElementById("cart-items-badge");
let books = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let numOfCartItems = Object.values(cart).length;
let total = Object.values(cart).reduce(
  (sum, item) => sum + item.price * item.qty,
  0,
);

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const updateBadge = () => {
  const numOfCartItems = Object.values(cart).length;
  if (numOfCartItems) {
    cartItemsBadge.classList.remove("visually-hidden");
  } else {
    cartItemsBadge.classList.add("visually-hidden");
  }
  cartItemsBadge.innerText = `${numOfCartItems}`;
  return;
};

const displayNewCart = (cart) => {
  cartList.innerHTML = "";
  Object.values(cart).forEach((cartItem) => {
    const { asin, title, price, qty } = cartItem;
    const finalPrice = (qty * price).toFixed(2);
    cartList.innerHTML += `
    <li id="cart-${asin}" class="mb-3 border border-1 border-secondary rounded-2 p-2 list-unstyled">
        <div class="row justify-content-between">
            <p class="col-12 fw-bold">${title}</p>
            <div class="d-flex flex-column flex-md-row">
            <p class="col-12 col-md-5">Quantity: ${qty}</p>
            <p class="col-12 col-md-5">${price}$</p>
            </div>
            </div>
            <p class="col-12 col-md-5">Total= ${finalPrice}$</p>
        <button class="btn btn-secondary" onclick="removeFromCart('${asin}')">Remove</button>
    </li>
  `;
  });
  totalDisplay.innerText = `CART TOTAL: ${total.toFixed(2)}$`;
  updateBadge();
  saveCart();
};

const deleteCard = (e) => {
  e.target.parentElement.parentElement.parentElement.remove();
};

const removeFromCart = (bookAsin) => {
  const li = document.getElementById(`cart-${bookAsin}`);
  if (cart[bookAsin].qty === 0) {
    return;
  }
  total -= cart[bookAsin].price;
  if (cart[bookAsin].qty === 1) {
    li.remove();
    delete cart[bookAsin];
    displayNewCart(cart);
    return;
  }
  cart[bookAsin].qty--;
  displayNewCart(cart);
};

const addToCart = (bookAsin) => {
  const book = books.find((book) => book.asin === bookAsin);
  const { asin, title, price } = book;
  total += price;
  if (cart[bookAsin]) {
    cart[bookAsin].qty++;
  } else {
    cart[asin] = { ...book, qty: 1 };
  }
  displayNewCart(cart);
  return;
  const quantity = cart[bookAsin].qty;
  const finalPrice = price * quantity;
  const bookLi = document.getElementById(`cart-${asin}`);
  if (bookLi) {
    bookLi.innerHTML = `
    <li id="cart-${asin}" class="mb-3">
        <div class="row justify-content-between">
            <p class="col-12 col-md-5 fw-bold">${title}</p>
            <div class="d-flex flex-column">
            <p class="col-12 col-md-5">Quantity: ${quantity}</p>
            <p class="col-12 col-md-5">${price}$</p>
            <p class="col-12 col-md-5">Total= ${finalPrice}$</p>
            </div>
        </div>
        <button class="btn btn-secondary" onclick="removeFromCart('${asin}')">Remove</button>
    </li>
  `;
  } else {
    cartList.innerHTML += `
    <li id="cart-${asin}" class="mb-3">
        <div class="row justify-content-between">
            <p class="col-12 col-md-5 fw-bold">${title}</p>
            <div class="d-flex flex-column">
            <p class="col-12 col-md-5">Quantity: ${quantity}</p>
            <p class="col-12 col-md-5">${price}$</p>
            <p class="col-12 col-md-5">Total= ${finalPrice}$</p>
            </div>
        </div>
        <button class="btn btn-secondary" onclick="removeFromCart('${asin}')">Remove</button>
    </li>
  `;
  }
};

const displayCards = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error:", res.status);
      }
    })
    .then((data) => {
      books = data;
      data.forEach((book) => {
        const { asin, title, img, price, category } = book;
        cardsSpace.innerHTML += `
          <div class="col-12 col-md-6 col-lg-3 d-flex mb-3">
            <div class="card w-100">
                <img src="${img}" class="card-img-top" style="aspect-ratio: 1/1.6; object-fit: cover; object-position: -5px 0px" alt="${title}-img">
                <div class="card-body bg-body-tertiary d-flex flex-column">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text text-capitalize">${category}</p>
                    <p class="card-text fw-bold mt-auto">${price.toFixed(2)}$</p>
                    <div class="row justify-content-between mx-1 g-2 g-md-0">
                        <button class="btn btn-primary delete-card col-12 col-md-5" onclick="deleteCard(event)">Delete</button>
                        <button class="btn btn-primary buy-card col-12 col-md-5" onclick="addToCart('${asin}')">Add to Cart</button>
                    </div>

                </div>
            </div>
          </div>
        `;
      });
    })
    .catch((err) => {
      alert("Cannot fetch data from server.");
    });
};

buyBtn.addEventListener("click", () => {
  alert("Thanks for your purchase!");
});

displayCards();
displayNewCart(cart);
console.log(numOfCartItems);
