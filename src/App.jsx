import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import TextResult from "./components/TextResult";
import { extractTextWithGemini } from "./lib/geminiOCR";

export default function App() {
  const [files, setFiles] = useState([]);         // array of files
const [previews, setPreviews] = useState([]);   // array of preview URLs
  const [extractedText, setExtractedText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showManualCopy, setShowManualCopy] = useState(false);

  const [customPrompt, setCustomPrompt] = useState("Extract the text from this image.");

  // Generate preview URLs whenever files change
  useEffect(() => {
  const urls = files.map((f) => URL.createObjectURL(f));
  setPreviews(urls);
  return () => urls.forEach((u) => URL.revokeObjectURL(u));
}, [files]);

  async function handleExtract() {
  if (!files.length) {
    setError("No images selected.");
    return;
  }
  setError("");
  setLoading(true);
  setExtractedText("");

  try {
    // Send all images at once
    const text = await extractTextWithGemini(files, customPrompt);
    setExtractedText([text]);  // store as array with one item for TextResult
  } catch (err) {
    console.error("Gemini OCR error:", err);
    setError("OCR failed. Check API key or network.");
  } finally {
    setLoading(false);
  }
}


  async function handleOpenInChatGPT() {
    if (!extractedText.length) {
      setError("No extracted text to send.");
      return;
    }
    setError("");
    try {
      const allText = extractedText.join("\n\n---\n\n");
      await navigator.clipboard.writeText(allText);
      window.open("https://chat.openai.com", "_blank", "noopener,noreferrer");
    } catch (err) {
      console.warn("Clipboard write failed:", err);
      setShowManualCopy(true);
    }
  }

  // NEW: specifically open ChatGPT **app** on mobile (using custom scheme)
  async function handleOpenInChatGPTApp() {
    if (!extractedText.length) return;
    try {
      const allText = extractedText.join("\n\n---\n\n");
      await navigator.clipboard.writeText(allText);

      // ChatGPT app supports custom deep link on mobile
      window.location.href = "com.chat.openai://"; 
    } catch (err) {
      setShowManualCopy(true);
    }
  }

  async function handleRemove(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setExtractedText([]);
    setError("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow p-5">
    <h1 className="text-center text-xl font-semibold mb-3">Infinity-AI</h1>
    <p className="text-sm text-gray-500 text-center mb-4">
      Upload or take up to 5 photos, extract text with Gemini, then copy or open ChatGPT.
    </p>

    <Upload
      onFileSelect={setFiles}  
      previews={previews}
      onRemove={handleRemove}
    />

    <div className="mt-4">
      <label className="text-sm text-gray-600">Prompt</label>
      <input
        type="text"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        className="w-full p-2 border rounded mt-1"
      />
    </div>

    <div className="mt-4">
      <TextResult
        extractedText={extractedText}
        loading={loading}
        error={error}
        onExtract={handleExtract}
        onOpenChat={handleOpenInChatGPT}
        onOpenChatApp={handleOpenInChatGPTApp}  
        onCopy={() => {
          navigator.clipboard.writeText(extractedText.join("\n\n---\n\n")).catch(() => {
            setShowManualCopy(true);
          });
        }}
        hasImage={files.length > 0}
      />
    </div>

    {showManualCopy && (
      <div className="mt-3 p-2 text-xs text-amber-700 bg-amber-100 rounded">
        Couldn’t copy automatically. Select the text manually and copy.
      </div>
    )}
  </div>

  {/* Footer Section */}
  {/* Footer Section */}
<footer className="mt-6 w-full max-w-md bg-gray-100 rounded-2xl shadow-inner p-3 text-center">
  <p className="text-xs text-gray-600">
    Credits: <span className="font-semibold">Jagjeet</span>, <span className="font-semibold">Kislay</span>, <span className="font-semibold">Bhavesh</span>
  </p>
  <p className="text-[10px] text-gray-400 mt-1">
    © 2025 Infinity-AI. All rights reserved.
  </p>
</footer>

</div>

  );
}
