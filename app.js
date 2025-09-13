// ---------- GLOBALS ----------
let cart = [];

// ---------- LOAD PRODUCTS ----------
async function loadProducts() {
  const snapshot = await db.collection("products").get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderProducts(products);
}

function renderProducts(products) {
  const table = document.querySelector("#productTable tbody");
  table.innerHTML = "";
  products.forEach(p => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      <td>${p.stock}</td>
      <td><button onclick="addToCart('${p.id}','${p.name}',${p.price})">Add</button></td>
    </tr>`;
    table.innerHTML += row;
  });
}

// ---------- CART ----------
function addToCart(id, name, price) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const table = document.querySelector("#cartTable tbody");
  table.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item => {
    const total = item.qty * item.price;
    subtotal += total;
    const row = `<tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>₹${item.price}</td>
      <td>₹${total}</td>
      <td><button onclick="removeFromCart('${item.id}')">X</button></td>
    </tr>`;
    table.innerHTML += row;
  });
  document.getElementById("subtotal").innerText = subtotal;
}

// ---------- CHECKOUT ----------
async function checkout() {
  if (cart.length === 0) return alert("Cart empty!");

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const sale = {
    date: new Date().toISOString(),
    total,
    items: cart
  };

  await db.collection("sales").add(sale);
  cart = [];
  renderCart();
  loadSales();
  alert("Checkout successful!");
}

// ---------- SALES ----------
async function loadSales() {
  const snapshot = await db.collection("sales").orderBy("date","desc").get();
  const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderSales(sales);
}

function renderSales(sales) {
  const table = document.querySelector("#salesTable tbody");
  table.innerHTML = "";
  sales.forEach(s => {
    const row = `<tr>
      <td>${s.id}</td>
      <td>${new Date(s.date).toLocaleString()}</td>
      <td>₹${s.total}</td>
    </tr>`;
    table.innerHTML += row;
  });
}

// ---------- INIT ----------
loadProducts();
loadSales();
