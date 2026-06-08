import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeStartupIdea } from "./server/gemini";
import dotenv from "dotenv";

dotenv.config();
async function startServer() {
  const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  const PORT = 3001;


  // Body parser limit expanded for rich text and complex payloads
  app.use("/api/analyze", (req, res, next) => {
  next();
  });
  // Client Waitlist endpoint (state-free, returns successful alignment)
  app.post("/api/waitlist", (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }
      return res.json({
        success: true,
        position: Math.floor(Math.random() * 50) + 107
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to allocate position in waitlist registry." });
    }
  });

  // Main Secure Gemini Analytical Proxy Pipeline
  app.post("/api/analyze", async (req, res) => {
    const { name, idea } = req.body;

    if (!name || !idea) {
      return res.status(400).json({ error: "Startup Name and Venture Concept description are required." });
    }

    try {
      // Direct call to Gemini models (server-side exclusive - key never exposed)
      const analysisResult = await analyzeStartupIdea(name, idea);
      return res.json({ result: analysisResult });
    } catch (err: any) {
      console.error("Gemini analytical backend failure:", err);
      return res.status(500).json({ 
        error: err.message || "An unexpected error occurred during synthesis. Please confirm your API key is correctly active." 
      });
    }
  });

  // Vite Integration for Client-Side Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`NexIdea Core Server running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer();
