import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../src/types";

// Always initialize lazily to avoid crashing on startup if key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function analyzeStartupIdea(name: string, idea: string): Promise<AnalysisResult> {
  const ai = getAiClient();

  const prompt = `
    You are an extremely skeptical elite VC partner, strict regulatory compliance auditor, and world-class scientific expert.
    Analyze the following startup idea and generate a highly realistic, extremely objective business plan and validation output.
    
    Startup Name: "${name}"
    Startup Idea: "${idea}"
    
    GUIDELINES FOR CRITICAL ANALYSIS & PRIORITIZING REALISM OVER OPTIMISM:
    1. Assess this idea with rigor. Avoid general cheerleading, and identify the hard realities. Do not inflated scores. Be realistic.
    2. Assess the following seven specific feasibility elements on a 1-10 scale (where 1 is worst/most difficult/lowest feasibility, and 10 is ideal/perfect feasibility/easiest):
       - Technical Feasibility: Feasibility of implementing using standard, existing software, APIs, and engineering methods.
       - Scientific Feasibility: Whether the fundamental science required for this idea actually exists and is proven.
       - Regulatory Feasibility: Regulatory burden, compliance audits, certifications, licenses (FDA, HIPAA, SEC, FAA, etc.).
       - Market Demand: Urgency and size of the customer pain point.
       - Revenue Potential: Scalability of margins, customer lifetime value, and subscription potential.
       - Competition: Red ocean vs blue ocean. (1 means hyper-saturated with massive competitors; 10 means complete blue ocean).
       - Execution Complexity: Operational hassle, physical logistics, high Capex, or scientific research overhead.
    3. DETECT IMPOSSIBLE OR SPECULATIVE SCIENCE:
       If the startup idea relies on scientifically unproven, speculative, or impossible concepts (e.g. teleportation, time travel, faster-than-light speed, mind reading, cold fusion, perpetual motion, infinite energy, defying thermodynamics, anti-gravity, or telekinesis):
       - Set "isSpeculativeScience" to true.
       - set "scientificLimitationDetails" to a detailed explanation explicitly identifying the scientific blocks, physical laws breached, and speculative technology relied upon.
       - REDUCE feasibility scores significantly (reduce scientificFeasibility and technicalFeasibility to 1 or 2).
       - INCREASE execution complexity score (set executionComplexity to 9 or 10, denoting absolute difficulty/physical impossibility).
       - Explain the limitations in the corresponding reasoning fields.
       - Recalculate and heavily penalize the "overallScore" to be very low (e.g., 1.0 to 2.5 maximum out of 10), reflecting that the business cannot be built.
    4. IF THE SCIENCE AND TECHNOLOGY ARE FULLY FEASIBLE:
       - Set "isSpeculativeScience" to false.
       - Set "scientificLimitationDetails" to an empty string.
       - Evaluate realism objectively (e.g., hardware has lower technical/regulatory scores than standard B2B SaaS).
    
    Ensure all fields contain dense, professional insights. For each score element, provide 2-3 sentences of clear, realistic, objective logical reasoning explaining the rating.
    For launch plan, output a 30-day timeline divided by chunks (e.g., "Days 1-5", "Days 6-10", "Days 11-15", "Days 16-20", "Days 21-25", "Days 26-30").
    For revenue forecast, predict Year 1, Year 2, and Year 3.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a realistic and highly critical startup validator. You evaluate business, scientific, technical, and compliance risks with VC-partner skepticism.",
        temperature: 0.1, // Even lower temperature for strict structural adherence and analytical rigor
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "ideaSummary",
            "problemStatement",
            "targetAudience",
            "marketOpportunity",
            "competitorAnalysis",
            "swotAnalysis",
            "monetizationStrategy",
            "mvpFeatures",
            "technicalArchitecture",
            "investorPitch",
            "scores",
            "overallScore",
            "isSpeculativeScience",
            "scientificLimitationDetails",
            "startupNames",
            "domainSuggestions",
            "elevatorPitch",
            "launchPlan",
            "goToMarket",
            "revenueForecast"
          ],
          properties: {
            isSpeculativeScience: {
              type: Type.BOOLEAN,
              description: "Whether the idea relies on unproven, speculative, or impossible technology like teleportation, time travel, mind reading, perpetual motion, etc."
            },
            scientificLimitationDetails: {
              type: Type.STRING,
              description: "Detailed scientific limitation and physics justification if isSpeculativeScience is true. Leave empty if false."
            },
            ideaSummary: {
              type: Type.STRING,
              description: "A highly concise and premium Executive Summary of the startup concept."
            },
            problemStatement: {
              type: Type.STRING,
              description: "A sharp, clear outline of the exact pain point being solved."
            },
            targetAudience: {
              type: Type.STRING,
              description: "A definition of the primary, secondary, and tertiary target demographics/businesses."
            },
            marketOpportunity: {
              type: Type.STRING,
              description: "Market size description, tailwinds, and why now is the perfect time."
            },
            competitorAnalysis: {
              type: Type.ARRAY,
              description: "List of top 3 direct or indirect competitors.",
              items: {
                type: Type.OBJECT,
                required: ["name", "description", "strengths", "weaknesses"],
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  weaknesses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            swotAnalysis: {
              type: Type.OBJECT,
              required: ["strengths", "weaknesses", "opportunities", "threats"],
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            monetizationStrategy: {
              type: Type.ARRAY,
              description: "Suggested revenue models.",
              items: {
                type: Type.OBJECT,
                required: ["model", "description", "pricing"],
                properties: {
                  model: { type: Type.STRING, description: "e.g., B2B SaaS Subscription, Freemium with Add-ons, etc." },
                  description: { type: Type.STRING },
                  pricing: { type: Type.STRING, description: "The concrete proposed price points." }
                }
              }
            },
            mvpFeatures: {
              type: Type.ARRAY,
              description: "Roadmap divided into incremental product phases.",
              items: {
                type: Type.OBJECT,
                required: ["phase", "features"],
                properties: {
                  phase: { type: Type.STRING, description: "Phase name (e.g. Phase 1: Core MVP, Phase 2: Scale)." },
                  features: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            technicalArchitecture: {
              type: Type.OBJECT,
              required: ["frontend", "backend", "database", "architecture"],
              properties: {
                frontend: { type: Type.STRING, description: "Recommended frontend stack + justification." },
                backend: { type: Type.STRING, description: "Recommended backend stack + justification." },
                database: { type: Type.STRING, description: "Recommended database details." },
                architecture: { type: Type.STRING, description: "High-level infrastructural design pattern (e.g., Serverless microservices, Monolithic app on Cloud Run)." }
              }
            },
            investorPitch: {
              type: Type.OBJECT,
              required: ["headline", "problem", "solution", "marketSize", "businessModel", "teamNeeded"],
              properties: {
                headline: { type: Type.STRING, description: "Venture-ready headline pitch." },
                problem: { type: Type.STRING, description: "How to pitches the problem." },
                solution: { type: Type.STRING, description: "How the solution stands out." },
                marketSize: { type: Type.STRING, description: "Total Addressable Market metrics (TAM, SAM, SOM)." },
                businessModel: { type: Type.STRING },
                teamNeeded: { type: Type.STRING, description: "Roles needed to build the initial team." }
              }
            },
            scores: {
              type: Type.OBJECT,
              required: [
                "technicalFeasibility",
                "scientificFeasibility",
                "regulatoryFeasibility",
                "marketDemand",
                "revenuePotential",
                "competition",
                "executionComplexity"
              ],
              properties: {
                technicalFeasibility: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 rating on technical practicality of implementing." },
                    reasoning: { type: Type.STRING, description: "Detailed 2-3 sentence objective technical justification." }
                  }
                },
                scientificFeasibility: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 rating of fundamental science maturity and proof." },
                    reasoning: { type: Type.STRING, description: "Detailed 2-3 sentence scientific/physics review." }
                  }
                },
                regulatoryFeasibility: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 rating on compliance ease (10 is zero compliance weight, 1 is extreme regulatory burden)." },
                    reasoning: { type: Type.STRING, description: "Detailed regulatory/compliance compliance reviews." }
                  }
                },
                marketDemand: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 rating on potential size and customer pain urgency." },
                    reasoning: { type: Type.STRING, description: "Detailed reasoning reflecting customer target interest vectors." }
                  }
                },
                revenuePotential: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 rating on long term recurring high margins." },
                    reasoning: { type: Type.STRING, description: "Detailed operational pricing model scale analysis." }
                  }
                },
                competition: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 rating on blue-ocean vs crowded space (10 means zero direct rivals, 1 means extreme crowding)." },
                    reasoning: { type: Type.STRING, description: "Competitive entry barrier landscape review." }
                  }
                },
                executionComplexity: {
                  type: Type.OBJECT,
                  required: ["score", "reasoning"],
                  properties: {
                    score: { type: Type.INTEGER, description: "1-10 execution/operation difficulty rating (where 10 is almost impossible/physically speculative, 1 is direct simple setup)." },
                    reasoning: { type: Type.STRING, description: "Detailed execution complexity and physics barrier summary." }
                  }
                }
              }
            },
            overallScore: {
              type: Type.NUMBER,
              description: "Overall startup validator score calculated out of 10. Max represents ideal venture parameters. Should heavily penalize speculative science entries."
            },
            startupNames: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 highly creative and modern alternative brand name suggestions."
            },
            domainSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 available modern TLD/domain combinations."
            },
            elevatorPitch: {
              type: Type.STRING,
              description: "A 30-second high-impact elevator verbal pitch."
            },
            launchPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["day", "task"],
                properties: {
                  day: { type: Type.STRING, description: "Day range (e.g., 'Days 1-5', 'Days 6-10')" },
                  task: { type: Type.STRING, description: "Clear actionable GTM or engineering objective." }
                }
              }
            },
            goToMarket: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Go-to-market strategic channels."
            },
            revenueForecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["year", "revenue", "expenses"],
                properties: {
                  year: { type: Type.STRING },
                  revenue: { type: Type.STRING },
                  expenses: { type: Type.STRING }
                }
              },
              description: "3-year high-level revenue and operational cost forecast."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text received from Gemini API");
    }

    try {
      const parsed: AnalysisResult = JSON.parse(text.trim());
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse Gemini output as JSON", text);
      throw new Error("Invalid response format received from generation model.");
    }
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}
