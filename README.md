# SEO Analysis & Execution Assistant

> An AI-powered SEO intelligence platform that audits websites, generates keyword strategies, and produces industry-aware execution drafts — with built-in ethical user review controls.

---

## Overview

This project is a full-stack SaaS prototype built as an internship assignment to explore AI-assisted SEO workflows. It combines real website scraping, technical SEO analysis, and GPT-4o-mini powered content generation into a single structured pipeline — from data collection through to an interactive dashboard with editable execution drafts.

The system is designed around a core principle: **AI should assist, not automate.** Every generated content draft — LinkedIn posts, outreach emails, social captions, blog comments — is explicitly marked for human review before publishing. The product workflow reflects how a real marketing team might responsibly use AI to accelerate SEO work, not replace human judgement.

**Who it's for:** Small businesses, local service providers, and marketing teams who want fast, contextual SEO insights without requiring an in-house SEO specialist.

---

## Key Features

### 🏢 Organization Profiling
Collects structured business data: name, website URL, industry, target geography, services, audience, competitor URLs, and existing keywords. All fields are validated server-side using Zod before any processing begins.

### 🔍 Website Scraping
Uses Axios + Cheerio to extract real page content: title tags, meta descriptions, H1/H2/H3 headings, body paragraphs, and image alt attributes. Includes an anti-bot fallback that constructs context-aware synthetic data from org profile when scraping is blocked.

### 📊 Technical SEO Audit
Analyzes scraped data for common issues: missing meta descriptions, duplicate H1s, missing image alts, thin content, and heading structure problems. Issues are categorized by severity (high / medium / low) and used to calculate a weighted SEO health score.

### 🎯 AI Keyword Strategy
Generates three keyword tiers — primary, secondary, and long-tail — using GPT-4o-mini with full organization context injected (industry, geography, services, audience). Keywords are geo-targeted and search-intent aware.

### 🏆 Competitor Intelligence
Dynamically generates competitor content strategy insights based on the organization's industry and geography. Includes industry-matched content focus, keyword overlap opportunities, and shared content angles. Competitor overlap percentages are computed using a domain-hash function for stable, varied values in the realistic 55–82% range.

### 💡 AI Recommendations
Produces 4–5 prioritized, actionable SEO recommendations across Technical SEO, Content Strategy, Keywords, Backlinks, and Local SEO categories. Recommendations reference actual services, real industry directories (e.g. Practo, Lawrato), and specific geography.

### ✍️ Execution Assistant
The flagship feature. Generates four ready-to-use content drafts:
- **LinkedIn Post** — 3–4 paragraphs with industry-specific hashtags
- **Outreach Email** — under 110 words with a specific subject line
- **Social Media Caption** — punchy, location-aware, with emoji
- **Blog Comment Draft** — professional, industry-knowledgeable tone

All drafts are editable in-place and copy-to-clipboard ready.

### 🔒 Ethical User Review System
Every generated draft is explicitly gated behind a **"Human review required"** badge. The system produces content suggestions only — there is no automated posting, no bulk outreach, and no engagement simulation. This design choice is intentional and central to the product's value proposition.

### 📈 SaaS Dashboard
A structured report page with a score ring, breakdown cards, keyword pills, recommendation cards, competitor table, and execution textareas. Built with Tailwind CSS and a custom brand color system.

### 📄 PDF Export
Native browser `window.print()` export for sharing reports in PDF format.

---

## System Architecture

### High-Level Flow

```
Browser (React + Vite)
        │
        │  POST /api/organizations
        ▼
Express API (Node.js + TypeScript)
        │
        ├─► Zod Validation
        │
        │  POST /api/seo/analyze/:orgId
        │
        ├─► scraperService     (Axios + Cheerio)
        ├─► seoService         (Technical issue detection)
        ├─► calculateSEOScore  (Weighted scoring algorithm)
        ├─► keywordService     ─┐
        ├─► recommendationService ─┤ → openaiService → GPT-4o-mini
        ├─► executionService   ─┘         │
        ├─► competitorAnalysis (controller logic)
        │
        ▼
MongoDB (Mongoose)
        │
SEOReport saved
        │
        ▼
GET /api/seo/report/:reportId
        │
        ▼
Dashboard renders from live database document
```

### Request Lifecycle

1. Client sends `POST /api/organizations` with form data
2. Zod schema validates all fields — rejects with structured errors if invalid
3. Organization document saved to MongoDB
4. Client sends `POST /api/seo/analyze/:orgId`
5. Controller fetches org from DB, runs all services in sequence
6. OpenAI API called three times (keywords, recommendations, execution)
7. If OpenAI returns 429/error → industry-aware fallback generator runs
8. Complete SEOReport document saved to MongoDB
9. Client navigates to `/report/:reportId`
10. React fetches `GET /api/seo/report/:reportId` — dashboard renders

### OpenAI Integration Design

Each AI call uses a distinct, fully-parameterized prompt template:

| Prompt | Context Injected |
|---|---|
| `keywordPrompt` | name, industry, geography, services, audience, scraped headings |
| `recommendationPrompt` | industry, geography, services, audience, detected issues |
| `executionPrompt` | name, industry, geography, services, audience, generated keywords |

All prompts explicitly ban generic vocabulary (e.g. "solutions", "platform", "enterprise"), enforce local terminology, and require JSON output for deterministic parsing.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and API routing |
| TypeScript | Type-safe service and controller layer |
| Mongoose (v9) | MongoDB ODM with schema validation |
| Zod | Runtime input validation |
| Axios | HTTP client for web scraping |
| Cheerio | HTML parsing and DOM extraction |
| OpenAI SDK | GPT-4o-mini API integration |
| ts-node-dev | TypeScript hot-reload development server |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and dev bundler |
| TypeScript (TSX) | Type-safe component development |
| Tailwind CSS | Utility-first styling with custom design tokens |
| Axios | API client for backend communication |
| React Router v6 | Client-side page routing |
| Lucide React | Icon library |

### Database
| Technology | Purpose |
|---|---|
| MongoDB (local) | Document storage for organizations and reports |

---

## Project Flow

```
1. User fills Organization Form
   └── name, website, industry, geography, services, audience, competitors

2. Backend validates input with Zod
   └── Returns 400 with structured errors if invalid

3. Organization saved to MongoDB
   └── Returns { _id } for use in analysis

4. Frontend triggers SEO Analysis
   └── POST /api/seo/analyze/:organizationId

5. Scraper fetches website content
   └── Falls back to org-context synthetic data if blocked

6. Technical SEO analysis runs
   └── Issues detected → Score calculated (max 89, baseline 82)

7. AI Keyword Strategy generated
   └── 3-tier keyword output (primary / secondary / long-tail)

8. AI Recommendations generated
   └── 4–5 prioritized, industry-specific actions

9. AI Execution Drafts generated
   └── 4 content drafts for LinkedIn, email, social, blog

10. Competitor analysis constructed
    └── Industry-matched content focus + keyword/heading overlap

11. Full SEOReport saved to MongoDB
    └── All data in single document

12. Frontend navigates to /report/:reportId
    └── Dashboard fetches and renders live data
```

---

## AI Prompt Engineering

### Design Philosophy

The core challenge in AI integration is preventing generic output. Without strict context injection, GPT defaults to "SaaS marketing" language regardless of what organization is being analyzed. The solution was to make every prompt **refuse** to work without business-specific context.

Each prompt contains:
- An explicit role declaration (`"You are a specialist content writer for the [industry] industry"`)
- A business context block with all 6 org parameters
- A strict vocabulary ban (`"never use: solutions, platform, enterprise, digital transformation"`)
- A structural enforcement block (e.g. `"LinkedIn post: 3–4 short paragraphs, 3–4 industry hashtags"`)
- JSON-only output instruction with schema definition

### Fallback Strategy

When the OpenAI API is unavailable (quota, timeout, or connectivity), `openaiService.ts` runs `generateIndustryAwareFallback()`. This function:

1. Parses the prompt string using regex to extract org context (name, industry, geography, services, audience)
2. Detects industry category by checking both the `industry` field and `services` string (e.g. "Healthcare" + "Dental Cleaning" → dental branch)
3. Generates structured JSON using industry-specific templates with real org data interpolated

This ensures the dashboard is **never empty** even when OpenAI is unavailable, and the outputs still use the correct business name, location, and service terminology.

### Hallucination Reduction

- Prompts request only JSON output — no prose, no markdown fences
- Each prompt bounds the answer scope to the provided business context
- Recommendations are verb-led ("Create", "Add", "Fix") to prevent vague advice
- Keywords must include the actual geography and service name — not invented ones

---

## Ethical Execution Design

The Execution Assistant is the most differentiated feature of this project, and its design reflects a deliberate stance on AI automation ethics.

### What the system does

- Generates content **drafts** — not published content
- Marks every draft with a persistent **"Human review required"** badge
- Makes all drafts **editable in-place** before use
- Provides **copy-to-clipboard** as the only "action" — the user must manually publish

### What the system deliberately does not do

- ❌ No automated posting to LinkedIn, Twitter, or any social platform
- ❌ No bulk outreach sending
- ❌ No fake engagement simulation
- ❌ No scheduled auto-publishing
- ❌ No content submission without human approval

### Why this matters

Automated content generation without human review creates real risks: factual errors, brand inconsistency, legal liability, and platform violations. By forcing a human checkpoint before any content reaches an audience, the system respects both the user's brand and their audience's trust.

This is not a technical limitation — it is a product decision.

---

## Folder Structure

### Backend

```
Backend/
├── src/
│   ├── app.ts                    # Express app setup, middleware, route mounting
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── constants/
│   │   └── index.ts              # HTTP status codes
│   ├── controllers/
│   │   ├── organizationController.ts
│   │   ├── seoController.ts      # Main analysis pipeline
│   │   └── executionController.ts
│   ├── middlewares/
│   │   ├── errorMiddleware.ts
│   │   └── notFoundMiddleware.ts
│   ├── models/
│   │   ├── Organization.ts       # Mongoose schema + interface
│   │   └── SEOReport.ts          # Full report document schema
│   ├── prompts/
│   │   ├── keywordPrompt.ts      # GPT keyword generation template
│   │   ├── recommendationPrompt.ts
│   │   └── executionPrompt.ts    # GPT content draft template
│   ├── routes/
│   │   ├── organizationRoutes.ts
│   │   ├── seoRoutes.ts
│   │   └── executionRoutes.ts
│   ├── services/
│   │   ├── scraperService.ts     # Axios + Cheerio web scraper
│   │   ├── seoService.ts         # Technical SEO issue detection
│   │   ├── openaiService.ts      # GPT integration + fallback
│   │   ├── keywordService.ts
│   │   ├── recommendationService.ts
│   │   └── executionService.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   └── seo.types.ts          # All shared TypeScript interfaces
│   ├── utils/
│   │   └── calculateSEOScore.ts  # Weighted scoring algorithm
│   └── validators/
│       └── organizationValidator.ts  # Zod schema
├── package.json
└── tsconfig.json
```

### Frontend

```
Frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                   # Router setup
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── SectionCard.tsx
│   │   ├── dashboard/
│   │   │   ├── ScoreCard.tsx         # SEO score ring + breakdown
│   │   │   ├── SEOIssues.tsx         # Issue severity cards
│   │   │   ├── KeywordSection.tsx    # Keyword pill groups
│   │   │   ├── Recommendations.tsx
│   │   │   ├── ExecutionAssistant.tsx  # Editable content drafts
│   │   │   ├── CompetitorAnalysis.tsx
│   │   │   └── LoadingSteps.tsx      # Animated pipeline loader
│   │   ├── forms/
│   │   │   └── OrganizationForm.tsx
│   │   └── layout/
│   │       └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx              # Form + analysis trigger
│   │   └── Report.tsx            # Full dashboard page
│   ├── services/
│   │   └── api.ts                # Axios API client
│   └── types/
│       └── seo.types.ts          # Shared TypeScript interfaces
├── tailwind.config.js
└── vite.config.ts
```

---

## API Documentation

### POST `/api/organizations`
Creates a new organization profile.

**Request body:**
```json
{
  "name": "SmileDentalCare",
  "website": "https://smiledentalcare.com",
  "industry": "Healthcare",
  "targetAudience": "Families and working professionals",
  "targetGeography": "Bangalore, India",
  "services": ["Dental Cleaning", "Root Canal", "Teeth Whitening"],
  "competitors": ["https://clonedental.in", "https://apollo247.com"],
  "currentKeywords": ["dental clinic bangalore", "teeth cleaning"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": { "_id": "664f...", "name": "SmileDentalCare", ... }
}
```

---

### GET `/api/organizations/:id`
Retrieves an organization by ID.

---

### POST `/api/seo/analyze/:organizationId`
Runs the full SEO analysis pipeline for the given organization.

**Response:**
```json
{
  "success": true,
  "message": "SEO analysis completed successfully",
  "data": {
    "_id": "665a...",
    "organizationId": "664f...",
    "seoScore": 77,
    "scoreBreakdown": { "technical": 27, "content": 25, "keywords": 16, "backlinks": 9 },
    "issues": [{ "type": "missing_meta_description", "severity": "high", "message": "..." }],
    "keywords": { "primaryKeywords": [...], "secondaryKeywords": [...], "longTailKeywords": [...] },
    "recommendations": [{ "category": "Local SEO", "suggestion": "...", "impact": "high" }],
    "competitorAnalysis": { "contentFocus": "...", "keywordOverlap": [...], "headingOverlap": [...] },
    "executionAssistant": { "linkedinPost": "...", "outreachEmail": "...", "socialMediaCaption": "...", "blogCommentDraft": "..." }
  }
}
```

---

### GET `/api/seo/report/:reportId`
Retrieves a stored SEO report with populated organization data.

---

### POST `/api/execution/generate`
Regenerates execution content drafts for an existing organization.

**Request body:**
```json
{ "organizationId": "664f..." }
```

---

## Installation & Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongodb://localhost:27017`)
- OpenAI API key (optional — fallback generator runs without it)

### Backend

```bash
cd Backend
npm install

# Create .env file
cp .env.example .env
# Add your values (see Environment Variables section)

npm run dev
# Server starts on http://localhost:5555
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

---

## Environment Variables

Create `Backend/.env` with the following:

```env
PORT=5555
MONGO_URI=mongodb://localhost:27017/seo_analytics
OPENAI_API_KEY=sk-...
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Express server port. Defaults to 5000 if not set. |
| `MONGO_URI` | Yes | MongoDB connection string. Local or Atlas URI. |
| `OPENAI_API_KEY` | No | GPT-4o-mini API key. If absent or quota-exceeded, the fallback generator produces industry-aware content automatically. |

> ⚠️ Never commit your `.env` file. It is excluded via `.gitignore`.

---

## Screenshots

| View | Description |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | Full SEO report dashboard with score ring, keywords, and recommendations |
| ![Execution Assistant](docs/screenshots/execution.png) | AI-generated content drafts with copy and edit controls |
| ![Competitor Intelligence](docs/screenshots/competitor.png) | Competitor overlap table and strategic focus section |
| ![Loading Pipeline](docs/screenshots/loading.png) | Animated step-by-step analysis progress with countdown |

> Screenshots can be added to `/docs/screenshots/`.

---

## Engineering Challenges

### 1. Scraping Reliability
Many production websites use Cloudflare or aggressive anti-bot measures. A naive scraper returns HTML error pages or empty content. The solution was a two-layer fallback: first attempt real scraping with a browser `User-Agent` header; if the response fails or is empty, construct synthetic scraped data from the organization profile to ensure AI prompts receive meaningful context instead of `"Mocked Website Title"`.

### 2. AI Output Consistency
Without context constraints, GPT defaults to generic marketing language regardless of the business type. A dental clinic would receive the same recommendations as a SaaS startup. The fix was to treat the prompt as a strict contract: all 6 org parameters are required fields, generic vocabulary is explicitly banned, and output format is enforced as typed JSON.

### 3. TypeScript + Mongoose v9 Type Inference
Mongoose v9 introduced stricter generic inference that conflicted with custom interface extensions. Saving documents with fields not in the inferred type caused compilation errors. Resolved by using `new Model({ ... } as any).save()` at the controller boundary while maintaining full type safety at the service and API response layers.

### 4. Frontend/Backend Field Alignment
The `ScoreCard` component originally recalculated the breakdown independently from the backend data, creating a data sync inconsistency. Fixed by passing the `scoreBreakdown` object directly from the report API response to the component as a prop.

### 5. SEO Score Realism
An initial score ceiling of 94/100 made the tool feel unrealistically optimistic — no real website scores near perfect. Lowered the baseline to 82, added a 3–7 point randomized structural deduction (simulating undetectable gaps in Core Web Vitals, schema markup, and accessibility), and hard-capped the maximum at 89.

---

## Design Decisions

### Service Layer Architecture
Each concern (scraping, scoring, keyword generation, recommendations, execution) is a separate service with a single responsibility. This makes each component independently testable and replaceable — for example, swapping Cheerio for Puppeteer for dynamic site rendering, or replacing OpenAI with a local LLM, would require changes in only one file.

### User-Controlled Execution
Automation without control creates liability. The decision to keep every generated draft editable and require explicit copy/publish actions by the user was made to ensure the tool augments judgement rather than bypassing it. This also avoids platform violations from automated posting.

### Frontend in TypeScript (TSX)
Shared interfaces between `seo.types.ts` (frontend) and `seo.types.ts` (backend) enforce type consistency across the full API contract. Any backend response shape change would surface as a compile error in the frontend component.

### Local-First Geography
SEO is fundamentally local for small businesses. Every prompt, fallback, and competitor analysis template was built to prioritize geography-specific output (city names in keywords, local directories in backlink recommendations) over generic national-level SEO advice.

---

## Future Improvements

- **Real SERP Integration:** Replace AI-inferred keyword difficulty with actual search volume data from Google Search Console API or SerpAPI
- **Lighthouse Integration:** Replace the estimated scoring algorithm with real Core Web Vitals data from the PageSpeed Insights API
- **Backlink Analysis:** Integrate a real backlink database (Ahrefs, Moz, or OpenLinkProfiler) for accurate authority scoring
- **Scheduled Monitoring:** Cron-based re-analysis with score trend tracking over time
- **Multi-User Support:** JWT authentication, user accounts, and per-user report history
- **Report Versioning:** Compare scores across multiple analysis runs to track SEO improvement
- **AI Ranking Prediction:** Use historical score/keyword data to estimate ranking trajectory

---

## Deployment

| Service | URL |
|---|---|
| Frontend | _Add Vercel / Netlify URL here_ |
| Backend | _Add Railway / Render URL here_ |

---

## Project Summary

This project demonstrates a complete AI-assisted SEO workflow built on a modular Node.js backend, a React dashboard, and a structured OpenAI integration layer.

The key engineering decisions — service-layer architecture, Zod validation, typed API contracts, context-aware prompt templates, and graceful fallback generation — reflect production-style thinking applied to an internship scope.

The product's differentiator is not the AI itself, but the *structure* around it: every AI output is bounded by real business context, validated against a typed schema, and explicitly controlled by the user before it touches anything external. This makes the system trustworthy rather than just impressive.

The Execution Assistant, in particular, reflects a view of AI automation that many tools ignore: that the most responsible way to deploy generative AI in a professional context is to make it easy to review, easy to edit, and impossible to misuse by accident.

---

## Author

**Arvind Kumar**  
Full-Stack Developer — Internship Project  
GitHub: [Arvind-kumar2006](https://github.com/Arvind-kumar2006)

---

*Built as part of an AI automation and SEO tooling internship assignment. Stack: Node.js · Express · TypeScript · MongoDB · OpenAI · React · Tailwind CSS*
