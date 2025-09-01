// src/lib/geminiOCR.js
import { fileToBase64 } from "./fileToBase64";

/**
 * Extract text from one or more images using Gemini
 * @param {File[]} files - array of images
 * @param {string} userPrompt - custom prompt
 * @returns {Promise<string>} - combined text
 */
export async function extractTextWithGemini(files, userPrompt) {
  if (!files.length) return "";

  // Convert all images to Base64
  const base64Images = await Promise.all(files.map(fileToBase64));

  // Construct one combined prompt
  const combinedPrompt = `${userPrompt}\n\nImages:\n${base64Images
    .map((dataUrl, i) => `Image ${i + 1}: ${dataUrl}`)
    .join("\n\n")}`;

  const response = await fetch("/api/gemini-ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imagesBase64: base64Images.map((dataUrl) => dataUrl.split(",")[1]), // only base64
      mimeTypes: files.map((f) => f.type || "image/png"),
      prompt: userPrompt,
    }),
  });

  if (!response.ok) throw new Error("Backend OCR failed");

  const result = await response.json();
  return result.text || "";
}
