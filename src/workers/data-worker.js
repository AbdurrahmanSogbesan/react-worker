self.addEventListener("message", async (event) => {
  const { type, products, filter } = event.data;

  switch (type) {
    case "generate":
      const generatedProducts = await getProducts();
      self.postMessage({ products: generatedProducts, type: "generated" });
      break;

    case "filter":
      if (products && filter) {
        const filteredProducts = products.filter(
          (prod) => prod.category === filter
        );
        self.postMessage({ products: filteredProducts, type: "filtered" });
      }
      break;

    default:
      break;
  }
});

function getProducts() {
  const products = Array.from({ length: 5000 }, () => ({
    id: Math.random().toString(36).substring(2, 9),
    name: `Product #${Math.floor(Math.random() * 1000)}`,
    category: ["Electronics", "Clothing", "Toys"][
      Math.floor(Math.random() * 3)
    ],
    price: Math.floor(Math.random() * 100),
  }));

  return Promise.resolve(products);
}
