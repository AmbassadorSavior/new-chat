import "../app.js";
import { $, oppCard, orgBadge, ring, esc, fmtDate, timeAgo, emptyStateHtml, setGreeting, greetWord, railPassportCard, railDeadlines, matchPill } from "../ui.js";
import { Store } from "../store.js";
import { recommend, deadlineInfo } from "../ai.js";
import { ALL_OPPS, getOpp } from "../data.js";

const user = Store.user();
setGreeting(`${greetWord()}, ${user.name.split(" ")[0]} 👋`, "Here are the opportunities Oppora matched to you today.");

/* Stats */
const saved = Store.saved();
const apps = Store.apps();
const week = ALL_OPPS.filter((o) => { const d = deadlineInfo(o).days; return d >= 0 && d <= 7; }).length;

(async () => {
  const recs = await recommend(8);
  const newMatches = recs.filter((r) => r.m.score >= 75).length;

  $("#statGrid").innerHTML = `
    <div class="stat-card"><div class="sc-top"><span class="sc-lbl">New matches</span><span class="sc-icon" style="background:var(--green-soft);color:var(--green)"><i class="bi bi-bullseye"></i></span></div><span class="sc-num count-up" data-count="${newMatches}">0</span><span class="sc-sub" style="color:var(--green)">+${Math.max(1, Math.round(newMatches / 3))} today</span></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-lbl">Saved</span><span class="sc-icon" style="background:var(--blue-soft);color:var(--blue)"><i class="bi bi-bookmark"></i></span></div><span class="sc-num">${saved.length}</span><a class="sc-sub link-arrow" style="font-size:12px" href="saved.html">View all <i class="bi bi-arrow-right"></i></a></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-lbl">Applications</span><span class="sc-icon" style="background:var(--violet-soft);color:var(--violet)"><i class="bi bi-kanban"></i></span></div><span class="sc-num">${apps.length}</span><span class="sc-sub" style="color:var(--violet)">${apps.filter((a) => a.status === "interview").length} in interview</span></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-lbl">Upcoming deadlines</span><span class="sc-icon" style="background:var(--amber-soft);color:var(--amber)"><i class="bi bi-clock-history"></i></span></div><span class="sc-num">${week}</span><span class="sc-sub" style="color:var(--amber)">next 7 days</span></div>`;

  /* Top matches list */
  const top = recs.slice(0, 4);
  $("#topMatches").innerHTML = top.map(({ opp: o, m }) => {
    const d = deadlineInfo(o);
    const isSaved = Store.isSaved(o.id);
    return `<div class="match-row">
      ${orgBadge(o, 42)}
      <div class="mr-body">
        <a class="mr-title" href="opportunity.html?id=${o.id}">${esc(o.title)}</a>
        <span class="mr-sub"><span>${esc(o.org)}</span><span>·</span><span>${o.funding.label}</span></span>
      </div>
      <span class="match-pill ${m.band}"><i class="bi bi-bullseye"></i>${m.score}%</span>
      <span class="small fw-bold" style="color:${d.days <= 7 ? "var(--red)" : "var(--blue)"};min-width:74px;text-align:right">Deadline<br>${fmtDate(o.deadline)}</span>
      <button class="save-btn ${isSaved ? "saved" : ""}" data-save="${o.id}" aria-label="Save"><i class="bi ${isSaved ? "bi-bookmark-fill" : "bi-bookmark"}"></i></button>
    </div>`;
  }).join("");

  /* AI recommendations with reasons */
  $("#aiRecs").innerHTML = recs.slice(0, 3).map(({ opp: o, m }) => `
    <div class="mb-3 pb-3" style="border-bottom:1px solid var(--line)">
      <div class="d-flex gap-2 align-items-start">${matchPill(m.score)}<a href="opportunity.html?id=${o.id}" class="fw-bold" style="color:var(--ink);font-size:14px">${esc(o.title)}</a></div>
      <div class="mt-2">${m.reasons.slice(0, 2).map((r) => `<div class="reason-row ok" style="padding:3px 0"><i class="bi bi-check2"></i>${esc(r.text)}</div>`).join("")}</div>
    </div>`).join("") + `<a class="link-arrow" href="explore.html?sort=match">See all recommendations <i class="bi bi-arrow-right"></i></a>`;

  /* Activity */
  const acts = Store.activity();
  $("#activityFeed").innerHTML = acts.length ? acts.slice(0, 6).map((a) => `
    <div class="d-flex gap-3 align-items-center py-2" style="border-bottom:1px solid var(--line)">
      <span class="sc-icon" style="background:var(--blue-softer);color:var(--blue);width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center"><i class="${a.icon}"></i></span>
      <div class="flex-fill"><span class="small fw-semibold" style="color:var(--ink)">${esc(a.text)}</span></div>
      <span class="small" style="color:var(--faint)">${timeAgo(a.ts)}</span>
    </div>`).join("") : emptyStateHtml({ icon: "bi-activity", title: "No activity yet", body: "Save, apply or update your Passport and your story builds here." });

  window.OPP_UI.initReveal();
})();

/* Right rail */
$("#app-rail").innerHTML = `
  <div class="rail-user">${window.OPP_UI.logoMark(0) ? "" : ""}<span class="nav-avatar">${window.OPP_UI.initials(user.name)}</span>
    <div style="min-width:0"><b style="color:var(--ink);font-size:14px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(user.name)}</b><span class="small" style="color:var(--muted)">${esc(Store.passport().headline || "Opportunity seeker")}</span></div>
    <a class="icon-btn ms-auto" style="width:34px;height:34px" href="profile.html" aria-label="Profile settings"><i class="bi bi-gear"></i></a>
  </div>
  ${railPassportCard()}
  ${railDeadlines(4)}
  <div class="ai-panel">
    <div class="ai-head"><span class="ai-logo"><i class="bi bi-stars"></i></span><b style="color:var(--ink);font-size:14px">Oppora Assist</b></div>
    <p class="small mb-3" style="color:var(--muted)">Ask about eligibility, documents or deadlines — or request fresh matches in plain language.</p>
    <a class="btn-op btn-op-soft btn-op-sm btn-op-block" href="messages.html"><i class="bi bi-chat-dots"></i>Chat with Assist</a>
  </div>`;
window.dispatchEvent(new CustomEvent("opp:render"));
