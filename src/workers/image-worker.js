self.addEventListener("message", (event) => {
  const imageUrl = event.data; // Receive image URL from the main thread

  // Simulate image processing (replace with your actual processing logic)
  const processingTime = Math.random() * 2000; // Simulate random processing time
  setTimeout(() => {
    const processedData = {
      // Replace with actual processed image data
      uploadedUrl: imageUrl,
      message: "Image processing complete!",
      // ... processed image data (e.g., resized image URL)
    };
    self.postMessage(processedData); // Send processed data back to main thread
  }, processingTime);
});
