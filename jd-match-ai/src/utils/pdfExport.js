/**
 * pdfExport.js
 * Generates a clean, branded PDF report from the analysis results.
 * Uses jsPDF for PDF generation (no canvas / screenshot approach
 * so it works reliably across all browsers).
 */

import { jsPDF } from 'jspdf';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Wrap text and draw it; returns the updated Y position. */
function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/** Draw a horizontal rule. */
function hr(doc, y, color = [226, 232, 240]) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  doc.line(14, y, 196, y);
  return y + 4;
}

/** Section header with coloured background band. */
function sectionHeader(doc, title, y, bgColor = [99, 102, 241]) {
  doc.setFillColor(...bgColor);
  doc.roundedRect(14, y, 182, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 18, y + 5.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  return y + 13;
}

/** Badge-style chip rendered as a small rounded rect. */
function badge(doc, label, x, y, fgColor, bgColor) {
  const w = doc.getTextWidth(label) + 6;
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, 'F');
  doc.setTextColor(...fgColor);
  doc.setFontSize(8);
  doc.text(label, x + 3, y);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  return w + 4; // width consumed
}

/** Check if we need a new page; add one if so. */
function checkPage(doc, y, threshold = 270) {
  if (y > threshold) {
    doc.addPage();
    return 20;
  }
  return y;
}

// ── Main export function ───────────────────────────────────────────────────

/**
 * exportToPDF
 * @param {Object} analysis - The full analysis object from Gemini
 */
export function exportToPDF(analysis) {
  const {
    matchScore,
    matchedSkills = [],
    missingSkills = [],
    strengths = [],
    improvements = [],
    atsKeywords = [],
    interviewQuestions = [],
    learningRoadmap = [],
  } = analysis;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 0;

  // ── Cover header ──────────────────────────────────────────────────────
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, PAGE_W, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('JD Match AI', MARGIN, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Resume vs Job Description Analysis Report', MARGIN, 23);

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.setFontSize(8);
  doc.text(`Generated: ${date}`, MARGIN, 30);

  // Score pill on the right
  const scoreLabel = `${matchScore}%`;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(PAGE_W - 44, 8, 30, 22, 4, 4, 'F');
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(scoreLabel, PAGE_W - 29, 22, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const quality =
    matchScore >= 90 ? 'Excellent' :
    matchScore >= 75 ? 'Good' :
    matchScore >= 60 ? 'Average' : 'Needs Work';
  doc.text(quality, PAGE_W - 29, 27, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  y = 52;

  // ── Match Score summary ───────────────────────────────────────────────
  y = sectionHeader(doc, '📊  Match Score', y);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  y = addWrappedText(
    doc,
    `Your resume scored ${matchScore}/100 against this job description (${quality} match).`,
    MARGIN, y, CONTENT_W
  );
  y += 5;

  // ── Matched Skills ────────────────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '✅  Matched Skills', y, [16, 185, 129]);
  doc.setFontSize(9);
  let bx = MARGIN;
  for (const skill of matchedSkills) {
    if (bx + doc.getTextWidth(skill) + 14 > PAGE_W - MARGIN) {
      bx = MARGIN;
      y += 8;
    }
    y = checkPage(doc, y);
    const w = badge(doc, skill, bx, y, [6, 78, 59], [209, 250, 229]);
    bx += w;
  }
  y += 10;

  // ── Missing Skills ────────────────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '⚠️  Missing Skills', y, [239, 68, 68]);
  doc.setFontSize(9);
  bx = MARGIN;
  for (const skill of missingSkills) {
    if (bx + doc.getTextWidth(skill) + 14 > PAGE_W - MARGIN) {
      bx = MARGIN;
      y += 8;
    }
    y = checkPage(doc, y);
    const w = badge(doc, skill, bx, y, [127, 29, 29], [254, 226, 226]);
    bx += w;
  }
  y += 10;

  // ── Strengths ─────────────────────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '💪  Strengths', y, [16, 185, 129]);
  doc.setFontSize(9);
  for (const s of strengths) {
    y = checkPage(doc, y);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(MARGIN, y - 3, CONTENT_W, 8, 1.5, 1.5, 'F');
    y = addWrappedText(doc, `• ${s}`, MARGIN + 3, y + 1, CONTENT_W - 6);
    y += 2;
  }
  y += 4;

  // ── Improvement Suggestions ───────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '🚀  Resume Improvement Suggestions', y);
  doc.setFontSize(9);
  for (let i = 0; i < improvements.length; i++) {
    y = checkPage(doc, y);
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(MARGIN, y - 3, CONTENT_W, 8, 1.5, 1.5, 'F');
    y = addWrappedText(doc, `${i + 1}. ${improvements[i]}`, MARGIN + 3, y + 1, CONTENT_W - 6);
    y += 2;
  }
  y += 4;

  // ── ATS Keywords ──────────────────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '🔑  ATS Keywords', y, [245, 158, 11]);
  doc.setFontSize(9);
  bx = MARGIN;
  for (const kw of atsKeywords) {
    if (bx + doc.getTextWidth(kw) + 14 > PAGE_W - MARGIN) {
      bx = MARGIN;
      y += 8;
    }
    y = checkPage(doc, y);
    const w = badge(doc, kw, bx, y, [120, 53, 15], [254, 243, 199]);
    bx += w;
  }
  y += 10;

  // ── Interview Questions ───────────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '❓  Interview Questions', y, [139, 92, 246]);
  doc.setFontSize(9);
  for (let i = 0; i < interviewQuestions.length; i++) {
    y = checkPage(doc, y);
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(MARGIN, y - 3, CONTENT_W, 9, 1.5, 1.5, 'F');
    y = addWrappedText(doc, `Q${i + 1}. ${interviewQuestions[i]}`, MARGIN + 3, y + 1, CONTENT_W - 6);
    y += 3;
  }
  y += 4;

  // ── Learning Roadmap ──────────────────────────────────────────────────
  y = checkPage(doc, y);
  y = sectionHeader(doc, '🗓️  4-Week Learning Roadmap', y, [6, 182, 212]);
  doc.setFontSize(9);
  for (const item of learningRoadmap) {
    y = checkPage(doc, y);
    doc.setFillColor(240, 253, 254);
    doc.roundedRect(MARGIN, y - 3, CONTENT_W, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Week ${item.week}: ${item.title}`, MARGIN + 3, y + 1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    y = addWrappedText(doc, item.description, MARGIN + 3, y + 6, CONTENT_W - 6);
    y += 4;
  }

  // ── Footer on every page ──────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `JD Match AI  |  Built for Digital Heroes  |  Page ${p} of ${totalPages}`,
      PAGE_W / 2,
      292,
      { align: 'center' }
    );
    doc.setTextColor(15, 23, 42);
  }

  doc.save('JDMatchAI_Analysis_Report.pdf');
}
