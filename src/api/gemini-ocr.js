/* eslint-env node */
/* eslint-env node */
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing API key" });
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { imagesBase64, mimeTypes, prompt } = req.body;
    if (!imagesBase64 || !imagesBase64.length) {
      res.status(400).json({ error: "No images provided" });
      return;
    }

    const content = [
      { text: prompt || "Extract the text from these images. Return verbatim text only." },
      ...imagesBase64.map((img, i) => ({
        inlineData: { data: img, mimeType: mimeTypes[i] || "image/png" }
      }))
    ];

    const result = await model.generateContent(content);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (err) {
    console.error("Gemini OCR error:", err);
    res.status(500).json({ error: "Gemini OCR failed" });
  }
}