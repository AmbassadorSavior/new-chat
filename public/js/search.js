/* ============================================================
   OPPORA — Search, filters, sorting & natural-language parsing
   ============================================================ */

import { ALL_OPPS, COUNTRIES, FIELDS } from "./data.js";
import { deadlineInfo } from "./ai.js";
import { Store } from "./store.js";

export function emptyState() {
  return { q: "", cats: [], countries: [], modes: [], levels: [], fields: [], funding: [], deadline: "", orgs: [], tags: [], sort: "match" };
}

const hay = (o) => [o.title, o.org, o.desc, o.cat, o.country, o.city, ...(o.skills || []), ...(o.fields || []), ...(o.tags || []), o.level, o.workMode, o.experience].join(" ").toLowerCase();

export function applyFilters(list, st) {
  const q = (st.q || "").toLowerCase().trim();
  return list.filter((o) => {
    if (q && !hay(o).includes(q)) return false;
    if (st.cats.length && !st.cats.includes(o.cat)) return false;
    if (st.countries.length && !st.countries.includes(o.country)) return false;
    if (st.modes.length && !st.modes.includes(o.workMode)) return false;
    if (st.levels.length && !st.levels.includes(o.level)) return false;
    if (st.fields.length && !st.fields.some((f) => (o.fields || []).includes(f))) return false;
    if (st.funding.length && !st.funding.includes(o.funding.kind)) return false;
    if (st.orgs.length && !st.orgs.includes(o.org)) return false;
    if (st.tags.length && !st.tags.some((t) => (o.tags || []).includes(t))) return false;
    if (st.deadline) {
      const b = deadlineInfo(o).bucket;
      if (st.deadline === "passed") { if (b !== "passed") return false; }
      else if (st.deadline === "week") { if (!["today", "3days", "week"].includes(b)) return false; }
      else if (st.deadline === "month") { const d = deadlineInfo(o).days; if (d < 0 || d > 31) return false; }
      else if (st.deadline === "open") { if (b === "passed") return false; }
    }
    return true;
  });
}

export async function sortList(list, sort, matchFn) {
  const arr = [...list];
  switch (sort) {
    case "closing": return arr.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    case "newest": return arr.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    case "funding": return arr.sort((a, b) => (b.funding.amountNum || 0) - (a.funding.amountNum || 0));
    case "title": return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "match":
    default: {
      if (!matchFn) return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      const scored = await Promise.all(arr.map(async (o) => ({ o, s: (await matchFn(o)).score })));
      return scored.sort((a, b) => b.s - a.s).map((x) => x.o);
    }
  }
}

/* ---------- Natural-language query → filters ---------- */
const CAT_WORDS = {
  scholarship: ["scholarship", "scholarships", "masters fund", "tuition"],
  job: ["job", "jobs", "vacancy", "employment", "hire", "role"],
  grant: ["grant", "grants", "funding", "seed capital"],
  internship: ["internship", "internships", "intern"],
  fellowship: ["fellowship", "fellowships"],
  competition: ["competition", "competitions", "hackathon", "challenge", "prize"],
  remote: ["remote work", "remote job", "work from anywhere", "remote"],
  volunteer: ["volunteer", "volunteering"],
  accelerator: ["accelerator", "incubator"],
  training: ["training", "course", "bootcamp"],
  conference: ["conference", "summit"],
  youth: ["youth", "young leaders"],
};
const LEVEL_WORDS = { Undergraduate: ["undergraduate", "bachelor", "bachelors", "bsc"], Postgraduate: ["master", "masters", "master's", "postgraduate", "msc", "mba"], Doctoral: ["phd", "doctoral", "doctorate"], Secondary: ["high school", "secondary"] };
const FIELD_WORDS = {
  "Computer Science": ["computer science", "software", "coding", "programming", "developer", "engineering intern"],
  "Data Science": ["data science", "data", "machine learning", "ai"],
  Engineering: ["engineer", "engineering"],
  "Business & Management": ["business", "management", "mba", "entrepreneur"],
  "Public Health": ["health", "medicine", "public health", "medical"],
  "Public Policy": ["policy", "government", "law"],
  Agriculture: ["agriculture", "agri", "farming", "food"],
  "Climate & Environment": ["climate", "environment", "energy", "sustainability", "green"],
  Education: ["education", "teaching", "teacher"],
  "Design & Media": ["design", "media", "creative", "ux"],
  Finance: ["finance", "fintech", "economics", "accounting"],
  "Social Sciences": ["social science", "sociology", "development studies"],
};
const COUNTRY_WORDS = COUNTRIES.map((c) => c.toLowerCase());
const REGION_WORDS = { europe: ["europe", "european", "eu", "uk", "united kingdom", "germany", "france", "netherlands"], africa: ["africa", "african"], "north america": ["usa", "us", "united states", "canada"] };

export function parseNatural(text) {
  const st = emptyState();
  let rest = " " + text.toLowerCase() + " ";
  const notes = [];

  for (const [cat, words] of Object.entries(CAT_WORDS)) {
    if (words.some((w) => rest.includes(" " + w + " ") || rest.includes(" " + w + ","))) { st.cats.push(cat); }
  }
  if (/fully[- ]funded|full funding|full scholarship/.test(rest)) { st.funding.push("fully"); notes.push("Fully funded only"); }
  if (/partial|partially/.test(rest)) st.funding.push("partial");
  if (/\bremote\b|work from (home|anywhere)/.test(rest) && !st.cats.includes("remote")) st.modes.push("remote");
  if (/\bhybrid\b/.test(rest)) st.modes.push("hybrid");
  if (/on[- ]?site|in[- ]office/.test(rest)) st.modes.push("onsite");
  for (const [lvl, words] of Object.entries(LEVEL_WORDS)) if (words.some((w) => rest.includes(w))) st.levels.push(lvl);
  for (const [f, words] of Object.entries(FIELD_WORDS)) if (words.some((w) => rest.includes(" " + w + " ") || rest.includes(" " + w + ","))) st.fields.push(f);
  for (const c of COUNTRY_WORDS) if (rest.includes(" " + c.split(" / ")[0] + " ") || rest.includes(c + ",")) st.countries.push(COUNTRIES.find((x) => x.toLowerCase() === c));
  for (const [region, words] of Object.entries(REGION_WORDS)) {
    if (words.some((w) => rest.includes(" " + w + " ") || rest.includes(" " + w + ","))) {
      if (region === "europe") st.countries.push(...["United Kingdom", "Germany", "France", "Netherlands"]);
      if (region === "north america") st.countries.push(...["United States", "Canada"]);
      notes.push(region === "africa" ? "Africa-hosted & Africa-eligible" : region + " region");
      if (region === "africa") st.tags.push("__africa");
    }
  }
  if (/closing soon|close soon|this week|urgent/.test(rest)) { st.deadline = "week"; notes.push("Closing this week"); }
  if (/women|female/.test(rest)) { st.tags.push("Women-focused"); notes.push("Women-focused"); }
  if (/startup|entrepreneur/.test(rest) && !st.cats.length) { st.tags.push("Startup funding", "Entrepreneurship"); }

  // strip recognised phrases so the free-text remainder stays meaningful
  const strip = [...Object.values(CAT_WORDS).flat(), ...Object.values(LEVEL_WORDS).flat(), ...Object.values(FIELD_WORDS).flat(), "fully funded", "full funding", "for african students", "african students", "that accept applicants from", "accept applicants from", "find", "show", "me", "please", "in", "for", "studying", "students", "with", "and", "the", "a"];
  let remainder = rest;
  strip.forEach((w) => { remainder = remainder.split(" " + w + " ").join(" "); });
  remainder = remainder.replace(/[^a-z0-9\s-]/g, " ").replace(/\s{2,}/g, " ").trim();
  const stopWords = new Set(COUNTRY_WORDS);
  st.q = remainder.split(" ").filter((w) => w.length > 2 && !stopWords.has(w)).slice(0, 4).join(" ");
  st.nlNotes = notes;
  return st;
}

export function africaOnly(list) { return list.filter((o) => ["Nigeria", "Kenya", "Ghana", "South Africa", "Rwanda", "Uganda", "Ethiopia", "Egypt", "Morocco", "Tanzania", "Senegal", "Cameroon", "Zimbabwe", "Zambia"].includes(o.country) || (o.countries || "").includes("African")); }

/* ---------- Shared listing engine used by Explore + category pages ---------- */
export function mountListing({ grid, bar, panel, state, baseFilter, matchFn, pageSize = 9 }) {
  let shown = pageSize;
  let results = [];

  async function run({ simulate = true } = {}) {
    if (simulate) {
      grid.innerHTML = Array.from({ length: 6 }, () => `<div class="skel-card"><div class="skel" style="height:44px;width:44px"></div><div class="skel" style="height:16px;width:80%"></div><div class="skel" style="height:12px;width:60%"></div><div class="skel" style="height:60px"></div></div>`).join("");
      await new Promise((r) => setTimeout(r, 320));
    }
    let list = baseFilter ? baseFilter(ALL_OPPS) : ALL_OPPS;
    if (state.tags.includes("__africa")) { state.tags = state.tags.filter((t) => t !== "__africa"); list = africaOnly(list); }
    results = applyFilters(list, state);
    results = await sortList(results, state.sort, Store.user() ? matchFn : null);
    await render();
  }

  async function render() {
    const { oppCard, emptyStateHtml } = window.OPP_UI;
    bar.innerHTML = renderBar(results.length);
    if (!results.length) {
      grid.innerHTML = emptyStateHtml({ icon: "bi-search", title: "No opportunities found", body: "Try removing one or more filters, or search with broader keywords — new opportunities are added every week.", action: `<button class="btn-op btn-op-soft btn-op-sm" data-clear-filters><i class="bi bi-arrow-counterclockwise"></i> Clear all filters</button>` });
      return;
    }
    document.querySelectorAll(".loadmore-wrap").forEach((w) => w.remove());
    const slice = results.slice(0, shown);
    let scores = {};
    if (Store.user() && matchFn) {
      scores = Object.fromEntries(await Promise.all(slice.map(async (o) => [o.id, (await matchFn(o)).score])));
    }
    grid.innerHTML = slice.map((o) => oppCard(o, { matchScore: scores[o.id] ?? null })).join("");
    const more = results.length - slice.length;
    const wrap = document.createElement("div");
    if (more > 0) {
      wrap.className = "text-center mt-4 loadmore-wrap";
      wrap.innerHTML = `<button class="btn-op btn-op-outline" data-load-more>Show ${Math.min(pageSize, more)} more <span class="text-muted fw-semibold">(${more} remaining)</span></button>`;
      grid.after(wrap);
      wrap.querySelector("[data-load-more]").addEventListener("click", () => { shown += pageSize; wrap.remove(); render(); });
    }
    grid.querySelectorAll("[data-clear-filters]").forEach((b) => b.addEventListener("click", () => window.dispatchEvent(new CustomEvent("opp:clearFilters"))));
  }

  function renderBar(n) {
    return `<span class="rb-count"><b>${n}</b> opportunit${n === 1 ? "y" : "ies"} found</span>`;
  }

  return { run, get results() { return results; }, showMore: () => { shown += pageSize; } };
}
