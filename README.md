# NexIdea — Validate Before You Build 🚀

NexIdea is an elite, senior VC-grade AI-powered startup validation MVP designed to analyze startup idea viability, competitive saturiation, and system frameworks in under 15 seconds.

## Main Product Architecture

1.  **Premium Startup SaaS Landing Screen**: Visually stunning, floating orange gradient glowing presets, accordion FAQs, value timelines, and interactive feature grids.
2.  **Interactive Venture Hub (Dashboard)**: Entry portals for raw startup ideas, live analytical phrase steps during loadings, and example presets.
3.  **Complete Validation Blueprints (Results Dashboard)**:
    *   **Circular Progress score gauge** compiled from operational demand vectors.
    *   **Mapped competitive saturation tables** with explicit core strengths & weaknesses.
    *   **SWOT strategic matrices**, 3-Year revenue caching, phased MVP specifications, and system stack listings.
4.  **Local Workspace DB**: Fully functional, bullet-proof sandbox local relational database tables simulating users, startup_ideas, saved_reports, and shares.
5.  **Secure Server Proxies**: Multi-tenant server routing proxying secure `@google/genai` model accesses without ever exposing raw secrets.

---

## Technical File Architecture

*   `/server.ts` — Custom full-stack Express engine hosting the Web API routes, user auth sessions, report caching, and Vite development handlers.
*   `/server/db.ts` — Relational database simulator reading and writing schema tables (`users`, `saved_reports`) locally in a safe file within the container.
*   `/server/gemini.ts` — Server-side GenAI controller querying `gemini-3.5-flash` with lower temperatures and custom input JSON schemas for flawless analytical reliability.
*   `/src/App.tsx` — Front-end application controller handling URL hashes, token authorization header storage, page router states, and feedback notices.
*   `/src/components/CircularProgress.tsx` — Custom dynamic vector SVG concentric circular scoring meter.
*   `/src/components/ResultsDashboard.tsx` — Elite 5-tab workspace dividing plans, technical metrics, investor decks, Domain suggestions, and GTM plans.
*   `/src/components/AuthModal.tsx` — Floating premium Glassmorphic portal for account registration.

---

## 🛠️ Step-by-Step Deployment Guide

Follow these steps to deploy NexIdea:

### 1. Configure the Gemini API Secret Key

NexIdea calls `gemini-3.5-flash` completely server-side.
Configure the environmental secret:

1.  Go to the **Settings > Secrets** panel in the Google AI Studio UI.
2.  Add a new secret name: `GEMINI_API_KEY`.
3.  Set its value to your valid Google AI Studio key starting with `AIzaSy`.

### 2. Standard Commands

*   To start the full-stack server under local development mode:
    ```bash
    npm run dev
    ```
*   To bundle and build both static client assets and Node API bundles into `/dist`:
    ```bash
    npm run build
    ```
*   To boot up standalone compiled assets ready for container launch:
    ```bash
    npm run start
    ```

### 3. Deploy to Cloud Run

NexIdea is built to launch natively inside container architectures like Cloud Run or Docker.
The build system utilizes `esbuild` to compile the entire backend server into a single self-contained CommonJS file (`dist/server.cjs`), eliminating absolute path conflicts and Node package cold starts!
The build script handles this fully out of the box when triggering `npm run build`.

---

Developed with absolute craftsmanship under AI Studio. Play smarter, validate faster, build stronger!
