import { z } from "zod";

export const AnalysisSchema = z.object({
  ideaSummary: z.string(),
  problemStatement: z.string(),
  targetAudience: z.string(),
  marketOpportunity: z.string(),
  overallScore: z.number(),

  startupNames: z.array(z.string()).default([]),
  domainSuggestions: z.array(z.string()).default([]),

  elevatorPitch: z.string(),

  // 🔥 NEW UI SUPPORT
  monetizationStrategy: z.array(
    z.object({
      model: z.string(),
      pricing: z.string(),
      description: z.string(),
    })
  ).default([]),

  revenueForecast: z.array(
    z.object({
      year: z.string(),
      revenue: z.string(),
      expenses: z.string(),
    })
  ).default([]),

  competitorAnalysis: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
    })
  ).default([]),

  technicalArchitecture: z.object({
    frontend: z.string().optional(),
    backend: z.string().optional(),
    database: z.string().optional(),
    architecture: z.string().optional(),
  }).default({
    frontend: "",
    backend: "",
    database: "",
    architecture: "",
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;