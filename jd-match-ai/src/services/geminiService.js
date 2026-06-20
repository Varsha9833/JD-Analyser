/**
 * geminiService.js
 * Handles all communication with the Google Gemini API.
 * Model: gemini-2.5-flash (confirmed available for this key).
 * Includes automatic retry with back-off on 429 rate-limit responses.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ── Prompt builder ────────────────────────────────────────────────────────
function buildPrompt(resume, jobDescription) {
  return `
You are an expert ATS (Applicant Tracking System) analyst and career coach.

Analyze the following resume against the job description and return ONLY a valid JSON object.
Do NOT include any markdown formatting, code blocks, or extra text — just raw JSON.

The JSON must follow this exact structure:
{
  "matchScore": <integer 0-100>,
  "matchedSkills": [<array of matched skill strings>],
  "missingSkills": [<array of missing skill strings>],
  "strengths": [<array of strength summary strings>],
  "improvements": [<array of actionable improvement suggestion strings>],
  "atsKeywords": [<array of important ATS keyword strings>],
  "interviewQuestions": [<array of exactly 10 likely interview question strings>],
  "learningRoadmap": [
    { "week": <number>, "title": <string>, "description": <string> }
  ]
}

Rules:
- matchScore: overall fit percentage (0-100)
- matchedSkills: skills that appear in both the resume and the JD
- missingSkills: skills required by the JD but absent from the resume
- strengths: 3-5 specific strengths of the candidate for THIS role
- improvements: 4-6 concrete, actionable suggestions to improve the resume
- atsKeywords: 8-12 high-value keywords from the JD the resume should contain
- interviewQuestions: exactly 10 role-specific interview questions
- learningRoadmap: a 4-week plan to fill the skill gaps (one object per week)

---RESUME---
${resume}

---JOB DESCRIPTION---
${jobDescription}
`;
}

// ── Sleep helper ──────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Parse retry-delay from 429 error message ──────────────────────────────
function parseRetryDelay(message) {
  // Gemini returns something like: "Please retry in 25.795844749s"
  const match = message?.match(/retry in (\d+(\.\d+)?)s/i);
  if (match) return Math.ceil(parseFloat(match[1])) * 1000;
  return 15000; // default 15 s
}

/**
 * analyzeResume
 * Sends resume + JD to Gemini and returns the parsed JSON analysis.
 * Retries once automatically on 429 rate-limit errors.
 *
 * @param {string} resume
 * @param {string} jobDescription
 * @returns {Promise<Object>}
 */
export async function analyzeResume(resume, jobDescription) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error(
      'Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.'
    );
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  // gemini-2.5-flash: confirmed available, free-tier friendly
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = buildPrompt(resume.trim(), jobDescription.trim());

  const MAX_RETRIES = 2;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let rawText;
    try {
      const result = await model.generateContent(prompt);
      rawText = result.response.text();
    } catch (err) {
      const msg = err.message || '';

      // 429 rate-limit → wait then retry
      if (msg.includes('429') && attempt < MAX_RETRIES) {
        const delay = parseRetryDelay(msg);
        console.warn(`Rate limited. Retrying in ${delay / 1000}s…`);
        await sleep(delay);
        continue;
      }

      // 404 model not found
      if (msg.includes('404')) {
        throw new Error(
          'The AI model is unavailable for your API key. Please generate a new key at https://aistudio.google.com/app/apikey'
        );
      }

      // Rate limit exhausted after retries
      if (msg.includes('429')) {
        throw new Error(
          'You have exceeded the Gemini free-tier rate limit. Please wait a minute and try again, or enable billing at https://console.cloud.google.com/billing'
        );
      }

      throw new Error(`Gemini API error: ${msg}`);
    }

    // Strip accidental markdown fences
    const cleaned = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error('The AI returned an unexpected format. Please try again.');
    }

    // Validate required keys
    const required = [
      'matchScore', 'matchedSkills', 'missingSkills',
      'strengths', 'improvements', 'atsKeywords',
      'interviewQuestions', 'learningRoadmap',
    ];
    for (const key of required) {
      if (!(key in parsed)) {
        throw new Error(`Invalid response: missing field "${key}". Please retry.`);
      }
    }

    return parsed;
  }
}
