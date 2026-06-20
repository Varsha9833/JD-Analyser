# JD Match AI — Resume vs Job Description Analyzer

A production-ready AI-powered SaaS tool that scores how well a resume matches a job description, identifies skill gaps, generates interview questions, and builds a personalized learning roadmap.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Match Score** | 0-100% score with animated progress ring |
| **Matched Skills** | Green badges for skills found in both resume & JD |
| **Missing Skills** | Red badges for skills required but absent |
| **Strengths** | AI-identified strengths for this specific role |
| **Improvement Suggestions** | Actionable resume improvement tips |
| **ATS Keywords** | Must-have keywords with Copy All button |
| **Interview Questions** | 10 role-specific questions in collapsible cards |
| **Learning Roadmap** | 4-week skill gap learning plan |
| **PDF Export** | Download full analysis report as PDF |
| **Local Storage** | Last analysis auto-saved & restored on refresh |

---

## 🛠️ Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Google Gemini API** (`gemini-1.5-flash`)
- **jsPDF** for PDF generation
- **Lucide React** for icons
- Deployable to **Vercel**

---

## 🚀 Quick Start

### 1. Clone / unzip the project

```bash
cd jd-match-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with your real key:

```
VITE_GEMINI_API_KEY=AIza...your_key_here
```

> Get a free API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### 5. Production build

```bash
npm run build
npm run preview
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add your environment variable:

```bash
vercel env add VITE_GEMINI_API_KEY
```

### Option B — Vercel Dashboard

1. Push the project to GitHub / GitLab
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — no extra config needed
4. Go to **Settings → Environment Variables** and add:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** your Gemini API key
5. Redeploy

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx            # Sticky nav with brand
│   ├── Footer.jsx            # Attribution + Digital Heroes CTA
│   ├── ResumeForm.jsx        # Dual textarea input form
│   ├── MatchScoreCard.jsx    # Animated score ring + quality badge
│   ├── SkillsSection.jsx     # Matched & missing skill badges
│   ├── SuggestionsSection.jsx# Strengths, improvements, ATS keywords
│   ├── InterviewQuestions.jsx# Collapsible Q&A cards
│   └── RoadmapSection.jsx    # 4-week timeline roadmap
├── services/
│   └── geminiService.js      # Gemini API integration
├── utils/
│   └── pdfExport.js          # jsPDF report generator
├── pages/
│   └── Home.jsx              # Main page / state orchestrator
├── App.jsx                   # Root layout
├── main.jsx                  # React entry point
└── index.css                 # Tailwind + custom animations
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |

**Never commit your `.env` file.** It is already in `.gitignore`.

---

## 📄 License

MIT — free to use and modify.

---

Built with ❤️ for Digital Heroes → [digitalheroesco.com](https://digitalheroesco.com)
