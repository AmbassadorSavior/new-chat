/* ============================================================
   OPPORA — AI service layer (OpporaAI client)
   ------------------------------------------------------------
   The prototype runs a transparent, deterministic matching
   engine locally so every score is explainable and testable.
   Each method mirrors a future production endpoint:
     match()        -> POST /api/ai/match
     recommend()    -> GET  /api/ai/recommendations
     eligibility()  -> POST /api/ai/eligibility
     summarize()    -> POST /api/ai/summarize
     assist()       -> POST /api/ai/assistant
   Replace the bodies with fetch() calls when the AI backend
   ships — the UI contracts stay identical.
   ============================================================ */

import { Store } from "./store.js";

const sim = (ms = 260) => new Promise((r) => setTimeout(r, ms + Math.random() * 180));
const norm = (s) => String(s || "").toLowerCase().trim();
const overlap = (a = [], b = []) => a.filter((x) => b.some((y) => norm(y) === norm(x)));

/* ---------- Matching ---------- */
export async function match(opp, passport = Store.passport()) {
  await sim(120);
  const reasons = [], missing = [], concerns = [];
  let score = 46;

  const pField = passport.education?.field;
  if (pField && (opp.fields || []).some((f) => norm(f) === norm(pField))) { score += 14; reasons.push({ ok: true, text: `Your field of study (${pField}) matches this opportunity` }); }
  else if (pField && (opp.fields || []).length === 0) { score += 8; reasons.push({ ok: true, text: "Open to all fields of study" }); }
  else if (pField) missing.push({ text: `Field: they focus on ${(opp.fields || []).slice(0, 2).join(", ") || "other areas"} — you listed ${pField}` });

  const pLevel = passport.education?.level;
  if (pLevel && (opp.level === "Any level" || norm(opp.level) === norm(pLevel))) { score += 10; reasons.push({ ok: true, text: opp.level === "Any level" ? "Your education level is accepted" : `Your education level (${pLevel}) matches the requirement` }); }
  else if (pLevel) missing.push({ text: `Education level: requires ${opp.level}, you listed ${pLevel}` });

  const pCountry = passport.country;
  const cEligible = !opp.countries || opp.countries === "All countries" || norm(opp.countries).includes("all") || norm(opp.countries).includes("african") && ["Nigeria", "Kenya", "Ghana", "South Africa", "Rwanda", "Uganda", "Ethiopia", "Egypt", "Morocco", "Tanzana", "Tanzania", "Senegal", "Cameroon", "Zimbabwe", "Zambia"].includes(pCountry) || norm(opp.countries) === norm(pCountry) || (passport.countriesOfInterest || []).includes(opp.country);
  if (pCountry && cEligible) { score += 12; reasons.push({ ok: true, text: opp.country === pCountry ? `Based in ${pCountry}, where this opportunity is hosted` : `Your location (${pCountry}) is eligible` }); }
  else if (pCountry) missing.push({ text: `Location: hosted in ${opp.country}; check whether your country qualifies` });

  const sk = overlap(passport.skills, opp.skills);
  if (sk.length) { score += Math.min(10, sk.length * 4); reasons.push({ ok: true, text: `Your skills match: ${sk.slice(0, 3).join(", ")}` }); }
  else if ((opp.skills || []).length) missing.push({ text: `Skills: they ask for ${(opp.skills || []).slice(0, 3).join(", ")}` });

  if ((passport.preferredTypes || []).includes(opp.cat)) { score += 6; reasons.push({ ok: true, text: "Matches an opportunity type you follow" }); }
  if ((passport.workModes || []).includes(opp.workMode)) { score += 5; reasons.push({ ok: true, text: `Fits your preferred work style (${opp.workMode})` }); }
  if ((passport.interests || []).some((i) => (opp.fields || []).some((f) => norm(f).includes(norm(i).split(" ")[0])) || norm(i) === norm(opp.cat))) { score += 4; reasons.push({ ok: true, text: "Aligns with interests in your Passport" }); }

  const dl = Math.ceil((new Date(opp.deadline) - Date.now()) / 86400000);
  if (dl >= 0 && dl <= 4) concerns.push({ text: `Deadline pressure: closes in ${dl === 0 ? "hours" : dl + " days"} — start documents now` });
  if (opp.experience && opp.experience !== "Any experience" && /5\+/.test(opp.experience) && norm(passport.status) === "student") concerns.push({ text: `Experience: asks for ${opp.experience}; position your internship work clearly` });
  if (!passport.skills?.length) missing.push({ text: "Your Passport has no skills yet — matching is less accurate" });

  score = Math.max(34, Math.min(97, Math.round(score)));
  return { score, reasons, missing, concerns, band: score >= 80 ? "high" : score >= 60 ? "mid" : "low" };
}

/* ---------- Recommendations ---------- */
export async function recommend(limit = 6, passport = Store.passport()) {
  const { ALL_OPPS } = await import("./data.js");
  const scored = [];
  for (const o of ALL_OPPS) scored.push({ opp: o, m: await match(o, passport) });
  const saved = Store.saved();
  scored.sort((a, b) => (b.m.score - a.m.score) || (saved.includes(b.opp.id) ? 1 : -1));
  return scored.slice(0, limit);
}

/* ---------- Eligibility checker ---------- */
export async function eligibility(opp, passport = Store.passport()) {
  await sim();
  const checks = [];
  const p = passport;
  const push = (ok, label, detail) => checks.push({ ok, label, detail });

  if (!p.country) push(null, "Location", "Add your country in the Passport to check location eligibility.");
  else if (!opp.countries || opp.countries === "All countries" || norm(opp.countries).includes(norm(p.country)) || (norm(opp.countries).includes("african") && p.country !== "United Kingdom" && p.country !== "United States")) push(true, "Location", `${p.country} applicants are within the eligible pool (${opp.countries || "all"}).`);
  else push(false, "Location", `This opportunity targets ${opp.countries}; your Passport lists ${p.country}.`);

  if (!p.education?.level) push(null, "Education level", "Add your current education level.");
  else if (opp.level === "Any level" || norm(opp.level) === norm(p.education.level)) push(true, "Education level", `${opp.level === "Any level" ? "All levels accepted" : opp.level + " required"} — matches your Passport.`);
  else push(false, "Education level", `Requires ${opp.level}; your Passport says ${p.education.level}.`);

  if (!p.skills?.length) push(null, "Skills", "Add at least three skills for an accurate skills check.");
  else if (overlap(p.skills, opp.skills).length) push(true, "Skills", `Overlap found: ${overlap(p.skills, opp.skills).join(", ")}.`);
  else push(null, "Skills", `No direct overlap with ${(opp.skills || []).join(", ") || "listed skills"} — still worth applying if you can evidence transferable skills.`);

  if (opp.age) { push(null, "Age range", `Provider states ${opp.age}. Confirm against your own details before applying.`); }

  const fails = checks.filter((c) => c.ok === false).length;
  const unknowns = checks.filter((c) => c.ok === null).length;
  const status = fails === 0 && unknowns === 0 ? "eligible" : fails === 0 ? "possible" : fails >= 2 ? "not" : "possible";
  return { status, checks };
}

/* ---------- Summarizer ---------- */
export async function summarize(opp) {
  await sim(320);
  const dl = new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return {
    what: `${opp.title} is a ${opp.cat} opportunity from ${opp.org}, hosted in ${opp.city}, ${opp.country} (${opp.workMode}).`,
    who: `Open to ${opp.level === "Any level" ? "all education levels" : opp.level + " candidates"}${opp.countries && opp.countries !== "All countries" ? ` from ${opp.countries}` : " worldwide"}${opp.age ? `, aged ${opp.age}` : ""}${opp.experience && opp.experience !== "Any experience" ? ` with ${opp.experience}` : ""}.`,
    benefits: (opp.benefits || []).slice(0, 4),
    deadline: `Applications close ${dl}.`,
    requirements: (opp.skills || []).length ? `Typical requirements: ${(opp.skills || []).join(", ")}.` : "No specific skills listed — review the documents section.",
    documents: (opp.docs || []).slice(0, 4),
    nextStep: "Run the eligibility check, gather the four core documents, and submit at least five days before the deadline.",
  };
}

/* ---------- Application assistant ---------- */
export async function assistant(opp, passport = Store.passport()) {
  await sim(300);
  const m = await match(opp, passport);
  const docs = (opp.docs || []).map((d) => ({ name: d, ready: (passport.skills || []).length > 2 && /CV|transcript|ID|passport/i.test(d) ? true : false }));
  const questions = [
    `“Why ${opp.org}, and why now?” — tie your answer to one line of their mission.`,
    `“Describe a project relevant to ${(opp.fields || [opp.cat])[0]}.” — prepare a 90-second story with a measurable result.`,
    opp.cat === "scholarship" || opp.cat === "fellowship" ? "“What will you do with this opportunity in 5 years?” — show a concrete plan for your community." : "“How do you handle ambiguity or tight deadlines?” — use a real example with numbers.",
  ];
  const prep = [
    `Tailor your CV to emphasise: ${(opp.skills || []).slice(0, 3).join(", ") || "your strongest transferable skills"}.`,
    "Ask two referees now — reference letters are the slowest document to chase.",
    `Draft the motivation statement against the benefits list (${(opp.benefits || [])[0]?.toLowerCase() || "their offer"}).`,
  ];
  return { docs, questions, prep, strength: m.score, strengthLabel: m.score >= 80 ? "Strong" : m.score >= 60 ? "Competitive" : "Stretch" };
}

/* ---------- Passport readiness ---------- */
export function readiness(passport) {
  const p = passport || Store.emptyPassport();
  const sections = [
    { key: "basics", label: "Basics & location", weight: 15, done: !!(p.fullName && p.country && p.status) },
    { key: "education", label: "Education", weight: 20, done: !!(p.education?.level && p.education?.field && p.education?.institution) },
    { key: "skills", label: "Skills (3+)", weight: 20, done: (p.skills || []).length >= 3 },
    { key: "experience", label: "Experience", weight: 12, done: !!p.experience },
    { key: "interests", label: "Interests & goals", weight: 13, done: (p.interests || []).length > 0 && !!p.careerGoal },
    { key: "prefs", label: "Preferences", weight: 12, done: (p.preferredTypes || []).length > 0 && (p.workModes || []).length > 0 },
    { key: "extras", label: "Certifications & funding needs", weight: 8, done: (p.certifications || []).length > 0 || !!p.fundingNeed },
  ];
  const completion = Math.round(sections.reduce((s, x) => s + (x.done ? x.weight : 0), 0));
  let score = completion;
  const strengths = [], missingActions = [];
  if ((p.skills || []).length >= 5) { score += 6; strengths.push("Deep skills list improves match accuracy"); } else missingActions.push({ text: "Add at least five skills", link: "passport.html#skills" });
  if (p.experience) { score += 6; strengths.push("Experience described — recruiters and reviewers see context"); } else missingActions.push({ text: "Describe your experience, even informal", link: "passport.html#experience" });
  if ((p.certifications || []).length) { score += 5; strengths.push("Certifications verified in Passport"); } else missingActions.push({ text: "Add certifications or courses", link: "passport.html#education" });
  if (p.careerGoal || p.entrepreneurshipGoal) { score += 5; strengths.push("Clear goal helps the matcher rank opportunities"); } else missingActions.push({ text: "Write a one-line career goal", link: "passport.html#goals" });
  if ((p.countriesOfInterest || []).length) { score += 4; strengths.push("Countries of interest set — regional filters applied"); } else missingActions.push({ text: "Pick countries you'd study or work in", link: "passport.html#preferences" });
  if (!sections[0].done) missingActions.push({ text: "Complete basics: name, country, current status", link: "passport.html#basics" });
  if (!sections[1].done) missingActions.push({ text: "Add your education details", link: "passport.html#education" });
  if (!(p.preferredTypes || []).length) missingActions.push({ text: "Choose opportunity types to follow", link: "passport.html#preferences" });
  return { completion, score: Math.min(99, score), sections, strengths, missingActions };
}

/* ---------- Deadline intelligence ---------- */
export function deadlineInfo(opp) {
  const ms = new Date(opp.deadline + "T23:59:59") - Date.now();
  const d = Math.floor(ms / 86400000);
  const h = Math.max(0, Math.floor((ms % 86400000) / 3600000));
  let bucket = "upcoming", label = `In ${d} days`;
  if (ms < 0) { bucket = "passed"; label = "Closed"; }
  else if (d === 0) { bucket = "today"; label = `Today · ${h}h left`; }
  else if (d <= 3) { bucket = "3days"; label = `In ${d} day${d > 1 ? "s" : ""}`; }
  else if (d <= 7) { bucket = "week"; label = `This week`; }
  return { days: d, hours: h, bucket, label, ms };
}

/* ---------- Messages assistant (rule-based stand-in) ---------- */
export async function assistReply(text, ctx = {}) {
  await sim(500);
  const t = norm(text);
  const { ALL_OPPS } = await import("./data.js");
  if (/recommend|suggest|match/.test(t)) {
    const recs = await recommend(3);
    return "Based on your Passport today: " + recs.map((r) => `${r.opp.title} (${r.m.score}% match)`).join(" · ") + ". Open Explore → Best match for details.";
  }
  if (/deadline|close|closing/.test(t)) {
    const soon = ALL_OPPS.map((o) => ({ o, d: deadlineInfo(o) })).filter((x) => x.d.days >= 0 && x.d.days <= 7).sort((a, b) => a.d.days - b.d.days).slice(0, 3);
    return soon.length ? "Closing within 7 days: " + soon.map((x) => `${x.o.title} (${x.d.label})`).join(" · ") + "." : "Nothing you can see closes this week — a good window to prepare documents for next month's deadlines.";
  }
  if (/document|checklist|prepare|cv|resume/.test(t)) {
    return "Core pack for most applications: 1) tailored 2-page CV, 2) motivation letter mapped to the benefits list, 3) certified transcripts, 4) two reference letters, 5) ID/passport copy. Open any opportunity and use the Application Assistant for its exact list.";
  }
  if (/eligib|qualif/.test(t)) {
    return "Open the opportunity page and hit “Check my eligibility” — I'll compare your Passport against location, education level, skills and age rules, and explain every line.";
  }
  if (/scholarship/.test(t)) {
    const s = ALL_OPPS.filter((o) => o.cat === "scholarship").slice(0, 3);
    return "Scholarships matching your profile right now: " + s.map((x) => x.title).join(" · ") + ". Full list under Scholarships.";
  }
  if (/grant|fund/.test(t)) {
    return "For funding, check the Grants board — filter by applicant type (startup, NGO, research, women-focused). The TEF Entrepreneurship Grant and AfDB Women Innovation Fund are open now.";
  }
  if (/hello|hi|hey/.test(t)) return "Hello! I can explain eligibility, build document checklists, track deadlines or recommend matches. What are we working on?";
  return "Got it. I've noted that against your Passport. Try asking me to “recommend something”, “what closes this week”, or “build me a document checklist” — and use the eligibility checker on any opportunity page for a line-by-line review.";
}
