// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AZURE_ENDPOINT}/vision/v3.2/ocr`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Ocp-Apim-Subscription-Key": process.env.REACT_APP_AZURE_KEY,
          },
        }
      );
      setOutput(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error analyzing image:", error);
      setOutput("Error analyzing image");
    }
  };

  return (
    <div className="App">
      <h1>OCR Analytics Page</h1>
      <div>
        <h2>Step 1</h2>
        <input type="file" onChange={handleImageChange} />
      </div>
      <div>
        <h2>Step 2</h2>
        <button onClick={handleAnalyze}>OCR Analyze</button>
      </div>
      <div>
        <h2>Step 3</h2>
        <textarea value={output} readOnly rows="10" cols="50" />
      </div>
    </div>
  );
}

export default App;
