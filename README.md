# nexIdea

> AI-powered system that evaluates startup ideas, generates structured insights, and helps founders validate business concepts instantly.
> NexIdea is a full-stack AI SaaS application that analyzes startup ideas using a structured LLM pipeline.
It transforms raw business ideas into actionable intelligence, including scoring, monetization strategies, market analysis, risk evaluation, and improvement suggestions.

The system is built with strict schema validation to ensure deterministic and reliable AI outputs.

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 📝 Description

nexIdea is an AI-driven startup validation platform designed to evaluate business ideas with rigorous technical, scientific, and regulatory analysis. The platform helps founders assess their startup concepts by generating detailed feasibility reports, simulating the rigorous evaluation process of an experienced venture capital partner, system architect, or regulatory auditor.

## ✨ Key Features

- **🤖 Gemini-Powered Idea Analysis** — Leverages the Google Gemini API to analyze startup ideas and generate structured venture feasibility reports.
- **🔌 Express.js Backend API** — Exposes a robust POST /api/analyze route to receive and process user-submitted startup data.
- **🎨 React and Tailwind UI** — Offers an interactive frontend dashboard built with Vite, React, and styled with Tailwind CSS.
- **🗄️ Supabase Integration Ready** — Configured with client environment variables to connect directly with Supabase services.
- **🛡️ TypeScript and Zod Validation** — Ensures type safety across the client and server with Zod parsing for schema verification.

## 🎯 Use Cases

- Entrepreneurs who want to stress-test business concepts against technical, regulatory, and financial constraints.
- Developers seeking a template for building full-stack AI-integrated dashboards with React, Express, and Vite.
- Incubators or hackathon organizers looking to provide a self-hosted tool for fast validation and MVP roadmapping.

## 🛠️ Tech Stack

- 🚀 **Express.js**
- ⚛️ **React**
- 🟩 **Supabase**
- 🌬️ **Tailwind CSS**
- 📘 **TypeScript**
- ⚡ **Vite**

**Notable libraries:** Zod

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/ItsShreena/nexIdea.git

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env   # then fill in the values

# 4. Start the dev server
npm run dev
```

## 🔑 Environment Variables

The following environment variables are required (see `.env.example`):

```bash
GEMINI_API_KEY=
APP_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## 📦 Key Dependencies

```
@google/genai: ^2.4.0
@supabase/supabase-js: ^2.107.0
@tailwindcss/vite: ^4.1.14
@vitejs/plugin-react: ^5.0.4
dotenv: ^17.2.3
express: ^4.21.2
jspdf: ^4.2.1
lucide-react: ^0.546.0
motion: ^12.23.24
node-fetch: ^3.3.2
react: ^19.0.1
react-dom: ^19.0.1
vite: ^6.2.3
zod: ^4.4.3
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **start** — `npm run start`
- **clean** — `npm run clean`
- **lint** — `npm run lint`

## 🌐 API Endpoints

Detected endpoints (best-effort scan):

```
GET /health
POST /api/analyze
POST /api/waitlist
GET *
```

## 📁 Project Structure

```
.
├── .env.example
├── firebase-blueprint.json
├── index.html
├── metadata.json
├── nexidea.rules
├── package.json
├── public
│   └── favicon.ico
├── security_spec.md
├── server
│   ├── openrouter.ts
│   └── schemas
│       └── analysisSchema.ts
├── server.ts
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── AuthModal.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── Dashboard.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── LandingPage.tsx
│   │   └── ResultsDashboard.tsx
│   ├── index.css
│   ├── lib
│   │   └── supabase.ts
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above


## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/ItsShreena/nexIdea.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.


