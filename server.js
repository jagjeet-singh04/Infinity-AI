// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Gemini API key not found. Add GEMINI_API_KEY in your .env file."
  );
}

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // increase limit for multiple images

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/gemini-ocr", async (req, res) => {
  try {
    const { imagesBase64, mimeTypes, prompt } = req.body;

    if (!imagesBase64 || !imagesBase64.length) {
      return res.status(400).json({ error: "No images provided" });
    }

    // Build the combined content array for Gemini
    const content = [];

    // Add user prompt
    content.push({ text: prompt || "Extract the text from these images. Return verbatim text only." });

    // Add all images as inline data
    imagesBase64.forEach((img, i) => {
      content.push({
        inlineData: {
          data: img,              // base64 image
          mimeType: mimeTypes[i] || "image/png",
        },
      });
    });

    // Generate combined text from all images
    const result = await model.generateContent(content);

    const response = await result.response;
    res.json({ text: response.text() });
  } catch (err) {
    console.error("Gemini OCR error:", err);
    res.status(500).json({ error: "Gemini OCR failed" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
