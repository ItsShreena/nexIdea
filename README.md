# 🚀 NexIdea — AI Startup Idea Analyzer

> AI-powered system that evaluates startup ideas, generates structured insights, and helps founders validate business concepts instantly.

---

## 📌 Overview

NexIdea is a full-stack AI application that analyzes startup ideas using a structured LLM pipeline.  
It converts raw ideas into actionable intelligence including scoring, monetization strategies, market analysis, and risk evaluation.

The system ensures deterministic outputs using strict schema validation.

---

## ✨ Features

- ⚡ AI-powered startup idea evaluation
- 📊 Structured scoring system (0–100)
- 💰 Monetization strategy generation
- 📈 Market demand analysis
- ⚠️ Risk detection engine
- 🧠 AI-driven improvement suggestions
- 🧾 History tracking system
- 🔐 Secure backend validation layer

---

## 🏗️ System Architecture


Frontend (React + Vite + TypeScript)
↓
Backend API (Node.js - server.ts)
↓
OpenRouter LLM (AI Engine)
↓
Schema Validation (analysisSchema.ts)
↓
Supabase Database (Storage)
↓
Frontend Dashboard Rendering


---

## 🧩 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React

### Backend
- Node.js
- Express (server.ts)
- OpenRouter API (LLM integration)
- Schema validation layer

### Database
- Supabase (PostgreSQL)

### Deployment
- Vercel (Full-stack deployment)

---

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


---

## 🔄 Data Flow

1. User enters startup idea in frontend
2. Request sent to backend API `/api/analyze`
3. Backend processes request in `server.ts`
4. Prompt sent to OpenRouter LLM
5. AI returns structured JSON response
6. Response validated using `analysisSchema.ts`
7. Data stored in Supabase
8. Frontend renders analysis dashboard

---

## 🧠 AI Engine

NexIdea uses a strict structured prompting system to ensure consistent output.

### Output Schema Example

```json
{
  "score": 85,
  "marketPotential": "High",
  "competitionLevel": "Medium",
  "monetization": ["SaaS", "Subscription"],
  "risks": ["High competition in productivity space"],
  "suggestion": "Focus on niche workflows instead of general tools"
}
Key Principles
No free-form responses
Strict JSON-only output
Schema validation enforced
Deterministic AI behavior
🔌 API Reference
POST /api/analyze

Analyzes a startup idea.

Request
{
  "name": "TaskFlow AI",
  "idea": "AI-powered task automation system from emails and messages"
}
Response
{
  "score": 84,
  "marketPotential": "High",
  "competitionLevel": "Medium",
  "monetization": ["SaaS", "Subscription"],
  "risks": ["Competitive productivity market"],
  "suggestion": "Focus on a specific niche workflow"
}
🔐 Security

Defined in security_spec.md:

Input sanitization for AI prompts
API validation layer
Schema enforcement before database writes
Environment variables protected via .env
No direct frontend database access
Secure API routing via /api/*
🌍 Environment Variables

Create a .env file:

OPENROUTER_API_KEY=your_key_here
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_key_here
🚀 Local Development
Install dependencies
npm install
Run development server
npm run dev
Open app
http://localhost:3001
📦 Production Build
npm run build
☁️ Deployment (Vercel)
vercel deploy

Configuration:

API routes → /api/*
Frontend → dist/
Backend → server.ts
🧪 Testing Ideas
SaaS productivity tools
Social networking apps
Weak ideas (edge cases)
Overly complex startup ideas
Duplicate submissions
🧱 Core Modules
Module	Description
server.ts	Backend API handler
openrouter.ts	AI integration layer
analysisSchema.ts	Response validation
Dashboard.tsx	Main UI dashboard
ResultsDashboard.tsx	Detailed analysis view
HistoryPage.tsx	Past idea tracking
🚀 Roadmap
AI pitch deck generator
Investor matching system
Real-time trend detection
Competitor analysis automation
Multi-model AI scoring system
Startup success prediction engine
👨‍💻 Author

NexIdea AI System

Focus:

Startup validation
AI reasoning systems
Full-stack SaaS architecture
📄 License

MIT License
