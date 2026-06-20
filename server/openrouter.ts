import { AnalysisResult, AnalysisSchema } from "./schemas/analysisSchema";
import crypto from "crypto";

const analysisCache = new Map<string, AnalysisResult>();

const BASE_PROMPT = `
You are a startup analyst.

Return only valid JSON. Do not wrap it in markdown. Do not include commentary.
Every score must be an integer from 0 to 10. Never use a 0-100 scale or decimals.
If a field is uncertain, provide a best-effort string or an empty array; do not use null.

The response must match this exact object shape:

{
  "ideaSummary": "string",
  "problemStatement": "string",
  "targetAudience": "string",
  "marketOpportunity": "string",
  "overallScore": 5,
  "startupNames": ["string"],
  "domainSuggestions": ["string"],
  "elevatorPitch": "string",
  "competitorAnalysis": [
    {
      "name": "string",
      "description": "string",
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  ],
  "swotAnalysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "goToMarket": ["string"],
  "monetizationStrategy": [
    {
      "model": "string",
      "pricing": "string",
      "description": "string"
    }
  ],
  "mvpFeatures": [
    {
      "phase": "string",
      "features": ["string"]
    }
  ],
  "technicalArchitecture": {
    "frontend": "string",
    "backend": "string",
    "database": "string",
    "architecture": "string"
  },
  "investorPitch": {
    "headline": "string",
    "problem": "string",
    "solution": "string",
    "marketSize": "string",
    "businessModel": "string",
    "teamNeeded": "string"
  },
  "scores": {
    "technicalFeasibility": { "score": 5, "reasoning": "string" },
    "scientificFeasibility": { "score": 5, "reasoning": "string" },
    "regulatoryFeasibility": { "score": 5, "reasoning": "string" },
    "marketDemand": { "score": 5, "reasoning": "string" },
    "revenuePotential": { "score": 5, "reasoning": "string" },
    "competition": { "score": 5, "reasoning": "string" },
    "executionComplexity": { "score": 5, "reasoning": "string" }
  },
  "launchPlan": [
    {
      "day": "string",
      "task": "string"
    }
  ],
  "revenueForecast": [
    {
      "year": "Year 1",
      "revenue": "string",
      "expenses": "string"
    },
    {
      "year": "Year 2",
      "revenue": "string",
      "expenses": "string"
    },
    {
      "year": "Year 3",
      "revenue": "string",
      "expenses": "string"
    }
  ],
  "isSpeculativeScience": false,
  "scientificLimitationDetails": "string"
}
`;

function generateCacheKey(name: string, idea: string): string {
  return crypto.createHash("sha256").update(`${name}:${idea}`).digest("hex");
}

function normalizeStrict(data: any): any {
  if (Array.isArray(data)) {
    return data.map(normalizeStrict);
  }

  if (data && typeof data === "object") {
    const normalized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      normalized[key] = normalizeStrict(value);
    }

    return normalized;
  }

  return data;
}

function clampScore(value: unknown): number {
  return Math.max(0, Math.min(10, Math.round(Number(value) || 0)));
}

function getFallback(): AnalysisResult {
  return {
    ideaSummary: "Analysis unavailable",
    problemStatement: "Analysis unavailable",
    targetAudience: "Unknown",
    marketOpportunity: "Unknown",
    overallScore: 5,
    startupNames: [],
    domainSuggestions: [],
    elevatorPitch: "",
    competitorAnalysis: [],
    swotAnalysis: {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    },
    goToMarket: [],
    monetizationStrategy: [],
    mvpFeatures: [],
    technicalArchitecture: {
      frontend: "",
      backend: "",
      database: "",
      architecture: "",
    },
    investorPitch: {
      headline: "",
      problem: "",
      solution: "",
      marketSize: "",
      businessModel: "",
      teamNeeded: "",
    },
    scores: {
      technicalFeasibility: { score: 5, reasoning: "" },
      scientificFeasibility: { score: 5, reasoning: "" },
      regulatoryFeasibility: { score: 5, reasoning: "" },
      marketDemand: { score: 5, reasoning: "" },
      revenuePotential: { score: 5, reasoning: "" },
      competition: { score: 5, reasoning: "" },
      executionComplexity: { score: 5, reasoning: "" },
    },
    launchPlan: [],
    revenueForecast: [],
    isSpeculativeScience: false,
    scientificLimitationDetails: "",
  };
}

export async function analyzeStartupIdea(
  name: string,
  idea: string
): Promise<AnalysisResult> {
  const cacheKey = generateCacheKey(name, idea);
  const cached = analysisCache.get(cacheKey);

  if (cached) {
    console.log("[CACHE HIT]", name);
    return cached;
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("[OPENROUTER ERROR] Missing OPENROUTER_API_KEY");
    return getFallback();
  }

  const prompt = `
Startup Name:
${name}

Idea:
${idea}

Generate a complete startup analysis.
Return all fields from the schema.
Return only JSON.
`;

  try {
    console.log("Starting OpenRouter request...");
    const start = Date.now();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 3000,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: BASE_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    console.log("OpenRouter response time:", Date.now() - start, "ms");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[OPENROUTER ERROR]", response.status, errorText);
      throw new Error(`OpenRouter ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    console.log("FINISH REASON:", data?.choices?.[0]?.finish_reason);
    console.log("CONTENT LENGTH:", content.length);

    if (!content) {
      console.error("[EMPTY RESPONSE]");
      return getFallback();
    }

    let parsed: any;

    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("[JSON PARSE FAILED]", err);
      console.error("[RAW CONTENT]", content);
      return getFallback();
    }

    const cleaned: any = normalizeStrict(parsed);

    cleaned.overallScore = clampScore(cleaned?.overallScore);

    if (cleaned?.scores && typeof cleaned.scores === "object") {
      for (const key of Object.keys(cleaned.scores)) {
        const item: any = cleaned.scores[key];
        if (item && typeof item === "object" && typeof item.score !== "undefined") {
          item.score = clampScore(item.score);
        }
      }
    }

    const validation = AnalysisSchema.safeParse(cleaned);

    if (!validation.success) {
      console.error("[SCHEMA VALIDATION FAILED]");
      console.error(validation.error.format());
      return getFallback();
    }

    analysisCache.set(cacheKey, validation.data);
    console.log("[ANALYSIS SUCCESS]", name);

    return validation.data;
  } catch (error) {
    console.error("[ANALYSIS ERROR]", error);
    return getFallback();
  }
}
