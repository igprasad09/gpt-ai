import express from "express";
import axios from "axios";
const routes = express.Router();

routes.post("/exe", async (req, res) => {
  const { code } = req.body;
  const { language } = req.body;
  const response = await axios.post(
    "https://emkc.org/api/v2/piston/execute",
    {
      language,
      version: "*",
      files: [{ name: `main.${language}`, content: code }],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if(response.data){
      return res.json({
        exe: response.data
      })
  }
  res.send("problem");
});

export default routes;
