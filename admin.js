// References
const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");

// Save product (Add or Update)
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("productId").value;
  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);

  if (id) {
    // Update existing product
    await db.collection("products").doc(id).update({ name, price, stock });
    alert("Product updated!");
  } else {
    // Add new product
    await db.collection("products").add({ name, price, stock });
    alert("Product added!");
  }

  productForm.reset();
  document.getElementById("productId").value = "";
  loadProducts();
});

// Load products
async function loadProducts() {
  const snapshot = await db.collection("products").get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderProducts(products);
}

function renderProducts(products) {
  productTable.innerHTML = "";
  products.forEach(p => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct('${p.id}','${p.name}',${p.price},${p.stock})">Edit</button>
        <button onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>`;
    productTable.innerHTML += row;
  });
}

// Edit product
function editProduct(id, name, price, stock) {
  document.getElementById("productId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("stock").value = stock;
}

// Delete product
async function deleteProduct(id) {
  if (confirm("Delete this product?")) {
    await db.collection("products").doc(id).delete();
    alert("Product deleted!");
    loadProducts();
  }
}

// Init
loadProducts();
