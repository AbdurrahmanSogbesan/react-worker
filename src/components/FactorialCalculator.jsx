import { useState, useEffect, useRef } from "react";

const FactorialCalculator = () => {
  const [result, setResult] = useState(null);
  const [number, setNumber] = useState(0);

  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/factorial-worker.js", import.meta.url)
    );
    workerRef.current.onmessage = (e) => {
      setResult(e.data);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleCalculate = () => {
    workerRef.current?.postMessage(number);
  };

  return (
    <div className="factorial-container">
      <h1>Factorial Calculator</h1>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
        className="number-input"
      />
      <button onClick={handleCalculate}>Calculate Factorial</button>
      {result && <div>Factorial: {result}</div>}
    </div>
  );
};

export default FactorialCalculator;
