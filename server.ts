import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeStartupIdea } from "./server/openrouter.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const isDev = process.env.npm_lifecycle_event === "dev";

async function startServer() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.get("/health", (req, res) => {
    res.json({ ok: true, service: "nexidea" });
  });

  app.post("/api/analyze", async (req, res) => {
    const name = req.body?.name;
    const idea = req.body?.idea;

    if (!name || !idea) {
      return res.status(400).json({
        error: "Startup Name and Venture Concept description are required.",
      });
    }

    try {
      const analysisResult = await analyzeStartupIdea(name, idea);

      console.log("[ANALYSIS SUCCESS]", {
        name,
        score: analysisResult.overallScore,
      });

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

  app.post("/api/waitlist", (req, res) => {
    const email = String(req.body?.email || "").trim();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    return res.json({
      ok: true,
      position: Math.floor(Date.now() / 1000) % 1000,
    });
  });

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`NexIdea running on http://localhost:${PORT}`);
  });
}

startServer();
