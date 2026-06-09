import { AnalysisSchema, AnalysisResult } from "./schemas/analysisSchema";

export async function analyzeStartupIdea(
  name: string,
  idea: string
): Promise<AnalysisResult> {

  const prompt = `
You are a STRICT JSON generator.

RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- ALL arrays must be arrays
- ALL numbers must follow schema rules

SCHEMA:
{
  "ideaSummary": "string",
  "problemStatement": "string",
  "targetAudience": "string",
  "marketOpportunity": "string",
  "overallScore": number,

  "startupNames": ["string"],
  "domainSuggestions": ["string"],
  "elevatorPitch": "string",

  "monetizationStrategy": [
    {
      "model": "string",
      "pricing": "string",
      "description": "string"
    }
  ],

  "revenueForecast": [
    {
      "year": "string",
      "revenue": "string",
      "expenses": "string"
    }
  ],

  "competitorAnalysis": [
    {
      "name": "string",
      "description": "string",
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  ],

  "technicalArchitecture": {
    "frontend": "string",
    "backend": "string",
    "database": "string",
    "architecture": "string"
  }
}
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "Return ONLY valid JSON. No markdown. No explanation.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error("Empty AI response");

    let parsed;

    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch {
      return getFallback(); // 🧠 SAFE EXIT
    }

    // =========================
    // 🔥 FIX 2: NORMALIZATION LAYER
    // =========================
    const normalized = normalizeAI(parsed);

    const result = AnalysisSchema.safeParse(normalized);

    if (!result.success) {
      console.error("Schema error:", result.error.flatten());
      return getFallback();
    }

    return result.data;

  } catch (err) {
    console.error("AI Error:", err);
    return getFallback();
  }
}

/**
 * 🧠 FIX 2 (IMPORTANT SAFETY LAYER)
 * Prevents AI shape mismatch crashes
 */
function normalizeAI(data: any) {
  return {
    ...data,

    monetizationStrategy: Array.isArray(data.monetizationStrategy)
      ? data.monetizationStrategy
      : [],

    revenueForecast: Array.isArray(data.revenueForecast)
      ? data.revenueForecast.map((r: any) => ({
          year: String(r.year ?? ""),
          revenue: String(r.revenue ?? ""),
          expenses: String(r.expenses ?? ""),
        }))
      : [],

    competitorAnalysis: Array.isArray(data.competitorAnalysis)
      ? data.competitorAnalysis.map((c: any) => ({
          name: String(c.name ?? ""),
          description: String(c.description ?? ""),
          strengths: Array.isArray(c.strengths) ? c.strengths : [],
          weaknesses: Array.isArray(c.weaknesses) ? c.weaknesses : [],
        }))
      : [],

    startupNames: Array.isArray(data.startupNames)
      ? data.startupNames
      : [],

    domainSuggestions: Array.isArray(data.domainSuggestions)
      ? data.domainSuggestions
      : [],
  };
}

function getFallback(): AnalysisResult {
  return {
    ideaSummary: "N/A",
    problemStatement: "N/A",
    targetAudience: "N/A",
    marketOpportunity: "N/A",
    overallScore: 0,

    startupNames: [],
    domainSuggestions: [],

    elevatorPitch: "N/A",

    monetizationStrategy: [],
    revenueForecast: [],
    competitorAnalysis: [],

    technicalArchitecture: {
      frontend: "",
      backend: "",
      database: "",
      architecture: "",
    },
  };
}