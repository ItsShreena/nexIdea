export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MonetizationModel {
  model: string;
  description: string;
  pricing: string;
}

export interface MvpFeaturePhase {
  phase: string;
  features: string[];
}

export interface TechnicalArchitecture {
  frontend: string;
  backend: string;
  database: string;
  architecture: string;
}

export interface InvestorPitchDec {
  headline: string;
  problem: string;
  solution: string;
  marketSize: string;
  businessModel: string;
  teamNeeded: string;
}

export interface ScoreItem {
  score: number; // 1-10 scale
  reasoning: string; // detailed context/reasoning for this specific score
}

export interface ScoreData {
  technicalFeasibility: ScoreItem;
  scientificFeasibility: ScoreItem;
  regulatoryFeasibility: ScoreItem;
  marketDemand: ScoreItem;
  revenuePotential: ScoreItem;
  competition: ScoreItem;
  executionComplexity: ScoreItem;
}

export interface LaunchPlanItem {
  day: string;
  task: string;
}

export interface RevenueForecastItem {
  year: string;
  revenue: string;
  expenses: string;
}

export interface AnalysisResult {
  ideaSummary: string;
  problemStatement: string;
  targetAudience: string;
  marketOpportunity: string;
  competitorAnalysis: Competitor[];
  swotAnalysis: SwotData;
  monetizationStrategy: MonetizationModel[];
  mvpFeatures: MvpFeaturePhase[];
  technicalArchitecture: TechnicalArchitecture;
  investorPitch: InvestorPitchDec;
  scores: ScoreData;
  overallScore: number;
  
  // Speculative Science Detection
  isSpeculativeScience: boolean;
  scientificLimitationDetails?: string; // Empty if false, contains limitations if true
  
  // Bonus items
  startupNames: string[];
  domainSuggestions: string[];
  elevatorPitch: string;
  launchPlan: LaunchPlanItem[];
  goToMarket: string[];
  revenueForecast: RevenueForecastItem[];
}

export interface SavedReport {
  id: string;
  userId: string | null; // Can be anonymous or from a specific user
  name: string;
  ideaDescription: string;
  result: AnalysisResult;
  createdAt: string;
}
