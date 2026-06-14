import { AnalysisSchema, AnalysisResult } from "./schemas/analysisSchema";
import crypto from "crypto";


const analysisCache = new Map<string, AnalysisResult>();
export async function analyzeStartupIdea(
  name: string,
  idea: string
): Promise<AnalysisResult> {
  const cacheKey = generateCacheKey(name, idea);

  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  const prompt = `
${BASE_PROMPT}

Startup Name:
${name}

Idea:
${idea}

Return ALL fields from the schema.
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
          model: "openai/gpt-4.1",
          temperature: 0.2,
          max_tokens: 8000,
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
      }
    );

    if (!response.ok) {
      console.error(
        "OPENROUTER ERROR:",
        response.status,
        await response.text()
      );
      return getFallback();
    }

    const data = await response.json();

    console.log(
      "RAW OPENROUTER:",
      JSON.stringify(data, null, 2)
    );

    const content =
      data?.choices?.[0]?.message?.content ?? "";

    if (!content) {
      console.log("EMPTY AI RESPONSE");
      return getFallback();
    }

    let parsed: any;

    try {
      parsed = JSON.parse(
        content.replace(/```json|```/g, "").trim()
      );
    } catch (error) {
      console.error("PARSE FAILED", error);
      return getFallback();
    }

    const cleaned = normalizeStrict(parsed);

    const result =
      AnalysisSchema.safeParse(cleaned);

    if (!result.success) {
      console.error(
        "SCHEMA FAILED",
        result.error.format()
      );

      return getFallback();
    }

    analysisCache.set(
      cacheKey,
      result.data
    );

    return result.data;
  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    return getFallback();
  }
}