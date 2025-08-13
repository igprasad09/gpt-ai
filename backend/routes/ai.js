import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
const routes = express.Router();
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GenAiKey });

routes.post("/", async (req, res) => {
   const {prompt} = req.body;
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  let text = "";
  for await (const chunk of response) {
    text += chunk.text;
  }
  res.write(text);
});

export default routes;
