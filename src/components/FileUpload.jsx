import { useCallback, useEffect, useRef, useState } from "react";

export default function FileUpload() {
  const [imageUrl, setImageUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const workerRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
  };

  const handleProcessImage = useCallback(() => {
    setProcessing(true);
    workerRef.current?.postMessage(imageUrl);
  }, [imageUrl]);

  const handleWorkerMessage = (event) => {
    setProcessing(false);
    setProcessedData(event.data);
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/image-worker.js", import.meta.url)
    );
    workerRef.current.onmessage = handleWorkerMessage;

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div className="upload-container">
      <input
        type="file"
        name="file-uploader"
        onChange={handleFileUpload}
        accept=".jpg, .jpeg, .png"
      />
      {imageUrl && (
        <button onClick={handleProcessImage} disabled={processing}>
          {processing ? "Processing..." : "Process Image"}
        </button>
      )}
      {processedData && (
        <>
          <p>{processedData.message}</p>
          <img
            src={processedData.uploadedUrl}
            alt="Processed Image"
            height={300}
            className="resized-image"
          />
        </>
      )}
    </div>
  );
}
