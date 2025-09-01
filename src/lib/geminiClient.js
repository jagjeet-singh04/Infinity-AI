// src/lib/geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Gemini API key not found. Add VITE_GEMINI_API_KEY in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generationConfig = {
  temperature: 0,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const AiChatSession = model.startChat({
  generationConfig,
  history: [],
});