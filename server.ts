import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeStartupIdea } from "./server/openrouter.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  const app = express();

  // Body parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  /**
   * =========================
   * WAITLIST API (demo)
   * =========================
   */
  app.post("/api/waitlist", (req, res) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res
          .status(400)
          .json({ error: "Please enter a valid email address." });
      }

      return res.json({
        success: true,
        position: Math.floor(Math.random() * 50) + 107,
      });
    } catch {
      return res.status(500).json({ error: "Waitlist system failure." });
    }
  });

  /**
   * =========================
   * AI ANALYSIS API
   * =========================
   */
  app.post("/api/analyze", async (req, res) => {
    const name = req.body?.name;
    const idea = req.body?.idea;

    if (!name || !idea) {
      return res.status(400).json({
        error: "Startup Name and Venture Concept description are required.",
      });
    }
    app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

    try {
      const analysisResult = await analyzeStartupIdea(name, idea);
      return res.json({ result: analysisResult });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";

      console.error("[ANALYZE_ERROR]", {
        message,
        name,
        ideaLength: idea?.length,
      });

      return res.status(500).json({
        error: message || "Analysis failed",
      });
    }
  });

  /**
   * =========================
   * VITE / STATIC SETUP
   * =========================
   */
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

  /**
   * =========================
   * START SERVER SAFELY
   * =========================
   */
  app.listen(PORT, () => {
    console.log(
      `NexIdea Core Server running securely on http://0.0.0.0:${PORT}`
    );
  });
}

startServer().catch((err) => {
  console.error("❌ Server failed to start:", err);
  process.exit(1);
});