const API_URL = "http://localhost:5000/products";

let cursor = null;
let category = "";

async function fetchProducts(reset = false) {
  let url = API_URL;

  const params = new URLSearchParams();

  if (category) {
    params.append("category", category);
  }

  if (!reset && cursor) {
    params.append("cursorUpdatedAt", cursor.updated_at);

    params.append("cursorId", cursor.id);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);

  const data = await res.json();

  renderProducts(data.data, reset);

  cursor = data.nextCursor;
}

function renderProducts(products, reset) {
  const container = document.getElementById("products");

  if (reset) {
    container.innerHTML = "";
  }

  products.forEach((product) => {
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>

      <p>
        Category:
        ${product.category}
      </p>

      <p>
        Price:
        ₹${product.price}
      </p>

      <p>
        Updated:
        ${new Date(product.updated_at).toLocaleString()}
      </p>
    `;

    container.appendChild(card);
  });
}

document.getElementById("category").addEventListener("change", (e) => {
  category = e.target.value;

  cursor = null;

  fetchProducts(true);
});

document.getElementById("loadMore").addEventListener("click", () => {
  fetchProducts();
});

fetchProducts(true);

card.innerHTML = `
  <h3>${product.name}</h3>

  <div class="category">
    ${product.category}
  </div>

  <div class="price">
    ₹${product.price}
  </div>

  <div class="updated">
    Updated:
    ${new Date(product.updated_at).toLocaleString()}
  </div>
`;
