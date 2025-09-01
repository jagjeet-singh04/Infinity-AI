import { fileToBase64 } from "./fileToBase64";

/**
 * Extract text from one or more images using Gemini API
 * @param {File[]} files - array of images
 * @param {string} userPrompt - custom prompt
 * @returns {Promise<string>} - extracted text
 */
export async function extractTextWithGemini(files, userPrompt = "") {
  if (!files || !files.length) return "";

  // Convert all images to Base64
  const base64Images = await Promise.all(files.map(fileToBase64));

  // Call the serverless API
  const response = await fetch("/api/gemini-ocr", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    imagesBase64: base64Images.map((dataUrl) => dataUrl.split(",")[1]),
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
