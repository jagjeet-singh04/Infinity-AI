// src/lib/geminiOCR.js
import { fileToBase64 } from "./fileToBase64";

export async function extractTextWithGemini(files, userPrompt = "") {
  if (!files || !files.length) return "";

  const base64Images = await Promise.all(files.map(fileToBase64));

  const response = await fetch("/api/gemini-ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imagesBase64: base64Images.map((dataUrl) => {
        // Remove the data:image/...;base64, part
        return dataUrl.split(",")[1];
      }),
      mimeTypes: files.map((f) => f.type || "image/png"),
      prompt: userPrompt || "Extract the text from these images. Return verbatim.",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Backend OCR failed");
  }

  const result = await response.json();
  return result.text || "";
}