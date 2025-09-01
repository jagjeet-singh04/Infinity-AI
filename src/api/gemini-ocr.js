import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Gemini API key not found. Add VITE_GEMINI_API_KEY in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { imagesBase64, mimeTypes, prompt } = req.body;

    if (!imagesBase64 || !imagesBase64.length) {
      return res.status(400).json({ error: "No images provided" });
    }

    const content = [{ text: prompt || "Extract the text from these images. Return verbatim." }];
    imagesBase64.forEach((img, i) => {
      content.push({
        inlineData: {
          data: img,
          mimeType: mimeTypes[i] || "image/png",
        },
      });
    });

    const result = await model.generateContent(content);
    const response = await result.response;

    res.status(200).json({ text: response.text() });
  } catch (err) {
    console.error("Gemini OCR error:", err);
    res.status(500).json({ error: "Gemini OCR failed" });
  }
}
