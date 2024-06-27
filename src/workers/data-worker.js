self.addEventListener("message", async (event) => {
  let products;

  const { type, products: currentProducts, filter } = event.data;

  switch (type) {
    case "generate":
      products = await getProducts();
      self.postMessage({ products, type: "generated" });
      break;

    case "filter":
      if (currentProducts && filter) {
        products = currentProducts.filter((prod) => prod.category === filter);
        self.postMessage({ products, type: "filtered" });
      }
      break;
    default:
      break;
  }
});

function getProducts() {
  const products = Array.from({ length: 5000 }).map(() => ({
    id: Math.random().toString(36).substring(2, 9),
    name: `Product #${Math.floor(Math.random() * 1000)}`,
    category: ["Electronics", "Clothing", "Toys"][
      Math.floor(Math.random() * 3)
    ],
    price: Math.floor(Math.random() * 100),
  }));

  return Promise.resolve(products);
}
