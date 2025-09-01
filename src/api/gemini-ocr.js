// /api/gemini-ocr.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini API key not found. Add GEMINI_API_KEY in your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imagesBase64, mimeTypes, prompt } = req.body;

    if (!imagesBase64 || !imagesBase64.length) {
      return res.status(400).json({ error: "No images provided" });
    }

    const content = [{ 
      text: prompt || "Extract the text from these images. Return verbatim text only." 
    }];
    
    imagesBase64.forEach((img, i) => {
      content.push({
        inlineData: {
          data: img,
          mimeType: mimeTypes[i] || "image/png",
        },
      });
    });

    const result = await model.generateContent({ contents: [{ role: "user", parts: content }] });
    const response = await result.response;

    res.status(200).json({ text: response.text() });
  } catch (err) {
    console.error("Gemini OCR error:", err);
    res.status(500).json({ error: "Gemini OCR failed" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};