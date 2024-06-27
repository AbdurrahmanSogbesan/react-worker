import { useState, useRef, useEffect, useCallback } from "react";

export default function Products() {
  const categories = ["Electronics", "Clothing", "Toys"];
  const [initialProducts, setInitialProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState("");

  const workerRef = useRef(null);

  const handleFilterProduct = useCallback(() => {
    setIsFiltering(true);
    workerRef.current.postMessage({
      type: "filter",
      filter,
      products: initialProducts,
    });
  }, [filter, initialProducts]);

  const handleReset = () => {
    setFilter("");
    setFilteredProducts(initialProducts);
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/data-worker.js", import.meta.url)
    );
    const worker = workerRef.current;

    const handleMessage = (event) => {
      const { type, products } = event.data;

      if (type === "generated") {
        setInitialProducts(products);
        setFilteredProducts(products);
        setIsLoading(false);
      } else if (type === "filtered") {
        setFilteredProducts(products);
        setIsFiltering(false);
      }
    };

    worker.addEventListener("message", handleMessage);
    worker.postMessage({ type: "generate" });

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
    };
  }, []);

  return (
    <div>
      <div className="filter-container">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="product-dropdown"
        >
          <option value="">All Products</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="product-btns">
          <button
            onClick={handleFilterProduct}
            disabled={isLoading || isFiltering || !filter}
            className="filter-btn"
          >
            {isLoading
              ? "Loading"
              : isFiltering
              ? "Filtering"
              : "Filter Products"}
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {isFiltering && <p>Filtering...</p>}

      {filteredProducts.length > 0 ? (
        <ul className="product-list">
          {filteredProducts.map((product) => (
            <li key={product.id} className="product-card">
              <div className="product-name">{product.name}</div>
              <div className="product-price">${product.price}</div>
              <div className="product-category">({product.category})</div>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No products found matching the filters.</p>
      )}
    </div>
  );
}
