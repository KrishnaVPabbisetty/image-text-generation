import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const analyzeImage = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AZURE_OCR_ENDPOINT}/vision/v3.1/ocr`,
        image,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.REACT_APP_AZURE_OCR_KEY,
            "Content-Type": "application/octet-stream",
          },
        }
      );
      setOcrResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error(err);
      setError("Error occurred while analyzing the image");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (ocrResult) {
      navigator.clipboard.writeText(ocrResult).then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Reset copy success message after 2 seconds
      });
    }
  };

  return (
    <div className="App">
      <h1>OCR Analytics Page</h1>
      <div className="container">
        <div className="step">
          <h2>Step 1</h2>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {/* <button onClick={() => analyzeImage()}>OCR Analyze</button> */}
        </div>
        <div className="step">
          <h2>Step 2</h2>
          <button disabled={loading || !image} onClick={analyzeImage}>
            {loading ? "Analyzing..." : "OCR Analyze"}
          </button>
        </div>
        <div className="step">
          <h2>Step 3</h2>
          <div className="output-container">
            <button className="copy-btn" onClick={handleCopy}>
              Copy
            </button>
            {copySuccess && <p className="copy-success">{copySuccess}</p>}
            {error ? <p className="error">{error}</p> : <pre>{ocrResult}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
