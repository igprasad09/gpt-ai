import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
const routes = express.Router();
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GenAiKey });

routes.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let text = "";
    for await (const chunk of response) {
      text += chunk.text || "";
    }

    res.status(200).send(text); // ✅ Ends properly
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating content");
  }
});


routes.get("/test",(req,res)=>{
      res.send("Working");
})

export default routes;
