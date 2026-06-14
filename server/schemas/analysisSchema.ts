import { z } from "zod";

export const AnalysisSchema = z.object({
  // Core Analysis
  ideaSummary: z.string(),
  problemStatement: z.string(),
  targetAudience: z.string(),
  marketOpportunity: z.string(),

  // Overall Score
  overallScore: z.number(),

  // Startup Branding
  startupNames: z.array(z.string()).default([]),
  domainSuggestions: z.array(z.string()).default([]),
  elevatorPitch: z.string().default(""),

  // Competitor Analysis
  competitorAnalysis: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      strengths: z.array(z.string()).default([]),
      weaknesses: z.array(z.string()).default([]),
    })
  ).default([]),

  // SWOT Analysis
  swotAnalysis: z.object({
    strengths: z.array(z.string()).default([]),
    weaknesses: z.array(z.string()).default([]),
    opportunities: z.array(z.string()).default([]),
    threats: z.array(z.string()).default([]),
  }).default({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  }),

  // Go-To-Market
  goToMarket: z.array(z.string()).default([]),

  // Monetization
  monetizationStrategy: z.array(
    z.object({
      model: z.string(),
      pricing: z.string(),
      description: z.string(),
    })
  ).default([]),

  // MVP Roadmap
  mvpFeatures: z.array(
    z.object({
      phase: z.string(),
      features: z.array(z.string()).default([]),
    })
  ).default([]),

  // Technical Architecture
  technicalArchitecture: z.object({
    frontend: z.string().default(""),
    backend: z.string().default(""),
    database: z.string().default(""),
    architecture: z.string().default(""),
  }).default({
    frontend: "",
    backend: "",
    database: "",
    architecture: "",
  }),

  // Investor Pitch Deck
  investorPitch: z.object({
    headline: z.string().default(""),
    problem: z.string().default(""),
    solution: z.string().default(""),
    marketSize: z.string().default(""),
    businessModel: z.string().default(""),
    teamNeeded: z.string().default(""),
  }).default({
    headline: "",
    problem: "",
    solution: "",
    marketSize: "",
    businessModel: "",
    teamNeeded: "",
  }),

  // Detailed Scores
  scores: z.object({
    technicalFeasibility: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),

    scientificFeasibility: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),

    regulatoryFeasibility: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),

    marketDemand: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),

    revenuePotential: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),

    competition: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),

    executionComplexity: z.object({
      score: z.number(),
      reasoning: z.string(),
    }),
  }),

  // Launch Plan
  launchPlan: z.array(
    z.object({
      day: z.string(),
      task: z.string(),
    })
  ).default([]),

  // Revenue Forecast
  revenueForecast: z.array(
    z.object({
      year: z.string(),
      revenue: z.string(),
      expenses: z.string(),
    })
  ).default([]),

  // Speculative Science Detection
  isSpeculativeScience: z.boolean().default(false),

  scientificLimitationDetails: z.string().optional(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;