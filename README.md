// ============================================================================
// 🚀 NEXIDEA - AI STARTUP IDEA ANALYZER
// ============================================================================

# 🚀 NexIdea

> **AI-powered Startup Idea Analyzer that evaluates, scores, and improves business ideas using structured reasoning, market intelligence, and monetization modeling.**

// ============================================================================
// 🧠 OVERVIEW
// ============================================================================

## 🧠 Overview

NexIdea is a full-stack AI system that transforms raw startup ideas into structured, data-driven insights.

It uses an LLM-based reasoning pipeline combined with strict schema validation to generate:

- 📊 Idea viability score (0–100)
- 💰 Monetization strategies
- 📈 Market potential analysis
- ⚠️ Risk identification
- 🧠 AI-generated improvement suggestions

// ============================================================================
// ✨ FEATURES
// ============================================================================

## ✨ Features

- ⚡ AI-powered idea evaluation engine
- 📊 Structured scoring system (deterministic JSON output)
- 💰 Monetization strategy generator
- 📈 Market demand & competition analysis
- ⚠️ Risk detection engine
- 🧾 User history tracking dashboard
- 🔐 Secure backend with schema validation
- ☁️ Supabase-powered persistence layer

// ============================================================================
// 🏗️ ARCHITECTURE
// ============================================================================
                ┌──────────────────────┐
                │   React Frontend     │
                │   (Vite + TS)        │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │  Node.js Backend     │
                │   (server.ts)        │
                └─────────┬────────────┘
                          │
  ┌───────────────────────┼────────────────────────┐
  ▼                       ▼                        ▼



// ============================================================================
// 🧩 TECH STACK
// ============================================================================

## 🧩 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React Icons

### Backend
- Node.js
- Express (server.ts)
- OpenRouter API (LLM integration)
- Strict schema validation layer

### Database
- Supabase (PostgreSQL)

### Deployment
- Vercel (Full-stack serverless deployment)

// ============================================================================
// 📁 PROJECT STRUCTURE
// ============================================================================

## 📁 Project Structure

nexidea/
│
├── server.ts
├── vercel.json
├── vite.config.ts
├── tsconfig.json
├── package.json
├── index.html
├── .env.example
│
├── nexidea.rules
├── metadata.json
├── firebase-blueprint.json
├── security_spec.md
│
├── server/
│ ├── openrouter.ts
│ └── schemas/
│ └── analysisSchema.ts
│
├── public/
│ └── favicon.ico
│
└── src/
├── main.tsx
├── App.tsx
├── index.css
├── types.ts
├── vite-env.d.ts
│
├── lib/
│ └── supabase.ts
│
├── components/
├── LandingPage.tsx
├── Dashboard.tsx
├── ResultsDashboard.tsx
├── HistoryPage.tsx
├── AuthModal.tsx
└── CircularProgress.tsx

// ============================================================================
// 🔄 DATA FLOW
// ============================================================================

## 🔄 Data Flow
User Input (Startup Idea)
↓
React Frontend (UI Layer)
↓
API Request → /api/analyze
↓
Backend (server.ts)
↓
OpenRouter LLM Processing
↓
Schema Validation (analysisSchema.ts)
↓
Supabase Database Storage
↓
Frontend Dashboard Rendering


// ============================================================================
// 🧠 AI ENGINE
// ============================================================================

## 🧠 AI Engine

NexIdea uses a **strict structured prompting system**.

### Example Output Schema

```json
{
  "score": 87,
  "marketPotential": "High",
  "competitionLevel": "Medium",
  "monetization": ["SaaS", "Subscription"],
  "risks": [
    "High competition in productivity space",
    "User acquisition cost may be high"
  ],
  "suggestion": "Focus on niche workflows instead of general productivity tools"
}
