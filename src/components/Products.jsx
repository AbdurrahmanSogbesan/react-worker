import { useState, useRef, useEffect } from "react";

const CATEGORIES = ["Electronics", "Clothing", "Toys"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("");

  const workerRef = useRef(null);

  const handleFilterProduct = () => {
    setStatus("filtering");
    workerRef.current.postMessage({ type: "filter", filter, products });
  };

  const handleReset = () => {
    setStatus("resetting");
    setTimeout(() => {
      setFilter("");
      setFilteredProducts(products);
      setStatus("idle");
    }, 500); // Simulating a short delay for visual feedback
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/data-worker.js", import.meta.url)
    );
    const worker = workerRef.current;

    const handleMessage = (event) => {
      const { type, products: newProducts } = event.data;
      if (type === "generated") {
        setProducts(newProducts);
        setFilteredProducts(newProducts);
        setStatus("idle");
      } else if (type === "filtered") {
        setFilteredProducts(newProducts);
        setStatus("idle");
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
          disabled={status !== "idle"}
        >
          <option value="">All Products</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="product-btns">
          <button
            onClick={handleFilterProduct}
            disabled={status !== "idle" || !filter}
            className="filter-btn"
          >
            Filter Products
          </button>
          <button onClick={handleReset} disabled={status !== "idle"}>
            Reset
          </button>
        </div>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "filtering" && <p>Filtering...</p>}
      {status === "resetting" && <p>Resetting...</p>}

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
        status === "idle" && <p>No products found matching the filters.</p>
      )}
    </div>
  );
}
