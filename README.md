# NexIdea 🚀

AI-powered startup idea validation platform that generates investor-grade feasibility reports using Google Gemini. NexIdea is an AI-driven platform that evaluates startup ideas with **VC-level skepticism**, combining technical, scientific, regulatory, and market analysis to generate a realistic venture feasibility report.

It simulates the mindset of an **elite venture capital partner + regulatory auditor + systems architect** to validate whether an idea is truly buildable and scalable.

## Features

* Startup Idea Analysis
* VC-Style Feasibility Scoring
* Scientific Feasibility Validation
* Regulatory Risk Assessment
* Competitor Analysis
* SWOT Analysis
* MVP Roadmap Generation
* Go-To-Market Strategy
* Revenue Forecasting
* Investor Pitch Generation
* Startup Name Suggestions
* Domain Suggestions

## Architecture

```text
Frontend (React + Vite)
          │
          ▼
   POST /api/analyze
          │
          ▼
Backend (Node.js + TypeScript)
          │
          ▼
 analyzeStartupIdea()
          │
          ▼
 Google Gemini API
          │
          ▼
 Structured JSON Response
          │
          ▼
 Frontend Dashboard
```

## Request Flow

1. User submits startup idea.
2. Frontend sends request to `/api/analyze`.
3. Backend validates input.
4. Gemini generates structured analysis.
5. Response is parsed and validated.
6. Results are rendered in the UI.

## Project Structure

```text
nexidea/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── types/
│   └── App.tsx
│
├── services/
│   └── geminiService.ts
│
├── server.ts
├── vite.config.ts
├── package.json
└── README.md
```

## Tech Stack

### Frontend

* React
* Vite
* TailwindCSS
* TypeScript

### Backend

* Node.js
* TypeScript

### AI

* Google Gemini
* Structured JSON Schema Output

## Environment Variables

```env
GEMINI_API_KEY=your_api_key
```

## API Endpoint

### POST /api/analyze

Request

```json
{
  "name": "Startup Name",
  "idea": "Startup Description"
}
```

Response

```json
{
  "overallScore": 7.8,
  "ideaSummary": "...",
  "scores": {},
  "swotAnalysis": {},
  "launchPlan": []
}
```

## Design Principles

* Realism over optimism
* Validation before execution
* Structured AI outputs
* Investor-focused insights

