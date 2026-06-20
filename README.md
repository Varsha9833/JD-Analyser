# 🧠 JD Match AI — Resume vs Job Description Analyzer

> An AI-powered SaaS tool that instantly scores how well your resume matches any job description, identifies skill gaps, generates interview questions, and builds a personalized learning roadmap.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-6366f1?style=for-the-badge)](https://jd-analyser-b9wwjsh18-varshajnv2004-9742s-projects.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/Varsha9833/JD-Analyser)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://jd-analyser-b9wwjsh18-varshajnv2004-9742s-projects.vercel.app/)

**🔗 Live URL:** https://jd-analyser-b9wwjsh18-varshajnv2004-9742s-projects.vercel.app/

**📁 GitHub:** https://github.com/Varsha9833/JD-Analyser

</div>

---

## 📸 Preview

| Input Form | Analysis Results |
|---|---|
| Paste resume + job description | AI scores your match instantly |
| Upload PDF or .txt resume | Get skills, roadmap & interview questions |

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Match Score** | 0–100% score with animated progress ring & quality badge |
| ✅ **Matched Skills** | Green badges for skills found in both resume & JD |
| ❌ **Missing Skills** | Red badges for required skills absent from resume |
| 💪 **Strengths** | AI-identified strengths for this specific role |
| 💡 **Improvement Suggestions** | Actionable tips to make your resume stronger |
| 🔑 **ATS Keywords** | Must-have keywords with one-click Copy All |
| ❓ **Interview Questions** | 10 role-specific questions in collapsible cards with STAR method tips |
| 🗺️ **Learning Roadmap** | Personalised 4-week skill gap learning plan |
| 📄 **PDF Export** | Download a full branded analysis report |
| 📜 **Score History** | Saves last 5 analyses locally, restore with one click |
| 🌙 **Dark Mode** | Full dark/light toggle, persisted across sessions |
| 📁 **File Upload** | Upload resume as PDF or .txt — text extracted automatically |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS v4** | Styling |
| **Google Gemini 2.5 Flash** | AI analysis engine |
| **jsPDF** | PDF report generation |
| **Lucide React** | Icon library |
| **Vercel** | Deployment & hosting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/Varsha9833/JD-Analyser.git
cd JD-Analyser/jd-match-ai
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=AIza...your_key_here
```

### 4. Start the development server

```bash
npm run dev
```

Visit **http://localhost:5173**

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## ☁️ Deployment (Vercel)

This project is deployed and live on Vercel.

### Deploy your own copy

1. Fork the repo on GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your fork
3. Set the following in Vercel project settings:

| Setting | Value |
|---|---|
| Root Directory | `jd-match-ai` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install --legacy-peer-deps` |

4. Add environment variable:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** your Gemini API key

5. Click **Deploy** — live in ~60 seconds ✅

---

## 📁 Project Structure

```
jd-match-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Sticky nav, dark mode toggle, GitHub link
│   │   ├── Footer.jsx            # Attribution + Digital Heroes CTA
│   │   ├── ResumeForm.jsx        # Dual textarea + PDF/TXT file upload
│   │   ├── MatchScoreCard.jsx    # Animated SVG ring + quality badge
│   │   ├── SkillsSection.jsx     # Matched & missing skill badges
│   │   ├── SuggestionsSection.jsx# Strengths, improvements, ATS keywords
│   │   ├── InterviewQuestions.jsx# Collapsible Q cards with STAR tips
│   │   └── RoadmapSection.jsx    # 4-week vertical timeline roadmap
│   ├── services/
│   │   └── geminiService.js      # Gemini API integration + retry logic
│   ├── utils/
│   │   └── pdfExport.js          # jsPDF branded report generator
│   ├── pages/
│   │   └── Home.jsx              # Main page, state, score history
│   ├── App.jsx                   # Root layout + dark mode state
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind v4 + custom animations
├── .env.example                  # Environment variable template
├── vercel.json                   # Vercel deployment config
└── README.md
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 👤 Author

**Varsha**
📧 [varshajnv2004@gmail.com](mailto:varshajnv2004@gmail.com)
🐙 [github.com/Varsha9833](https://github.com/Varsha9833)

---

## 🏆 Built For

<div align="center">

[![Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-6366f1?style=for-the-badge)](https://digitalheroesco.com)

[digitalheroesco.com](https://digitalheroesco.com)

</div>

---

## 📄 License

MIT — free to use, fork, and modify.
