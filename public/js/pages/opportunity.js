import "../app.js";
import { $, $$, orgBadge, deadlinePill, matchPill, fmtDate, toast, ring, esc, emptyStateHtml, shareModal, reportModal, verifiedTag } from "../ui.js";
import { getOpp, catOf, ALL_OPPS, orgOf } from "../data.js";
import { match, eligibility, summarize, assistant, deadlineInfo } from "../ai.js";
import { Store } from "../store.js";
import { applyModal } from "../applications.js";

const id = new URLSearchParams(location.search).get("id");
const opp = getOpp(id);
const root = $("#oppRoot");

if (!opp) {
  root.innerHTML = `<div class="container-narrow section">${emptyStateHtml({ icon: "bi-compass", title: "Opportunity unavailable", body: "This listing may have closed or been removed from the demo dataset. Explore the boards to find live matches.", action: '<a class="btn-op btn-op-primary" href="explore.html">Explore opportunities</a>' })}</div>`;
} else {
  render();
}

function render() {
  const cat = catOf(opp.cat);
  const org = orgOf(opp.org);
  const d = deadlineInfo(opp);
  const saved = Store.isSaved(opp.id);
  document.title = `${opp.title} — Oppora`;

  root.innerHTML = `
  <section class="opp-hero">
    <div class="container-opp">
      <nav class="breadcrumb-opp mb-3" aria-label="Breadcrumb">
        <a href="index.html">Home</a><i class="bi bi-chevron-right"></i>
        <a href="explore.html">Explore</a><i class="bi bi-chevron-right"></i>
        <a href="${cat.page}">${cat.label}</a><i class="bi bi-chevron-right"></i>
        <span style="color:var(--ink)">${esc(opp.title.slice(0, 42))}${opp.title.length > 42 ? "…" : ""}</span>
      </nav>
      <div class="d-flex flex-wrap gap-4 align-items-start">
        ${orgBadge(opp, 64)}
        <div style="flex:1;min-width:260px">
          <div class="d-flex flex-wrap gap-2 mb-2">
            <span class="pill pill-blue"><i class="${cat.icon}"></i>${cat.singular}</span>
            ${opp.featured ? '<span class="pill pill-grad"><i class="bi bi-stars"></i>Featured</span>' : ""}
            <span class="pill pill-grey"><i class="bi bi-database"></i>Demo listing</span>
          </div>
          <h1 style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;letter-spacing:-.02em">${esc(opp.title)}</h1>
          <div class="oc-meta mt-2" style="font-size:13.5px">
            <span>${orgBadge.length ? "" : ""}<i class="bi bi-building"></i>${esc(opp.org)} ${verifiedTag(opp)}</span>
            <span><i class="bi bi-geo-alt"></i>${esc(opp.city)}, ${esc(opp.country)}</span>
            <span><i class="bi bi-${opp.workMode === "remote" ? "globe2" : opp.workMode === "hybrid" ? "arrow-left-right" : "building"}"></i>${opp.workMode}</span>
            <span><i class="bi bi-cash-coin"></i>${esc(opp.funding.label)}</span>
            <span><i class="bi bi-people"></i>${opp.applicants.toLocaleString()} applicants</span>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="save-btn ${saved ? "saved" : ""}" data-save="${opp.id}" aria-pressed="${saved}"><i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i>${saved ? "Saved" : "Save"}</button>
          <button class="btn-op btn-op-outline" id="shareBtn" aria-label="Share"><i class="bi bi-share"></i>Share</button>
        </div>
      </div>
    </div>
  </section>

  <div class="container-opp">
    <div class="opp-detail-layout">
      <div>
        <div class="ai-panel mb-4" id="aiSummary">
          <div class="ai-head">
            <div><b style="color:var(--ink)">Oppora AI Summary</b><p class="small mb-0" style="color:var(--muted)">Condensed from the full listing. Production calls the Oppora summarisation API.</p></div>
            <button class="btn-op btn-op-soft btn-op-sm ms-auto" id="sumBtn"><i class="bi bi-lightning-charge"></i>Summarize</button>
          </div>
          <div id="sumBody" class="small" style="color:var(--body-c)">
            <div class="d-flex gap-2 align-items-center" style="color:var(--muted)"><span class="spinner-border spinner-border-sm"></span> Waiting for request… press Summarize to generate.</div>
          </div>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-card-text"></i>Overview</h2>
          <p style="font-size:15px">${esc(opp.desc)}</p>
          <p class="mt-3" style="font-size:14.5px;color:var(--muted)">This ${cat.singular.toLowerCase()} sits in the ${esc((opp.fields || []).join(", ") || opp.cat)} space and is delivered ${opp.workMode === "remote" ? "fully remotely" : opp.workMode === "hybrid" ? "in a hybrid format" : `on-site in ${esc(opp.city)}`}. ${opp.experience !== "Any experience" ? `Typical candidates bring ${esc(opp.experience)}.` : "No minimum experience is stated."}</p>
          <div class="kv-grid mt-3">
            <div class="kv"><i class="bi bi-mortarboard-board"></i><div><b>Education level</b>${esc(opp.level)}</div></div>
            <div class="kv"><i class="bi bi-globe-africa"></i><div><b>Eligible countries</b>${esc(opp.countries || "All countries")}</div></div>
            <div class="kv"><i class="bi bi-person-badge"></i><div><b>Experience</b>${esc(opp.experience)}</div></div>
            <div class="kv"><i class="bi bi-calendar-event"></i><div><b>Age range</b>${esc(opp.age || "Not specified")}</div></div>
          </div>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-building"></i>About ${esc(opp.org)}</h2>
          <p style="font-size:14.5px">${esc(opp.about)}</p>
          <div class="d-flex gap-2 mt-3 flex-wrap">
            <span class="pill pill-outline"><i class="bi bi-${opp.verified ? "patch-check-fill" : "question-circle"}" style="color:${opp.verified ? "var(--teal)" : "var(--amber)"}"></i>${opp.verified ? "Verified organisation" : "Verification pending"}</span>
            <span class="pill pill-outline"><i class="bi bi-link-45deg"></i>Source: ${esc(opp.source)}</span>
            <span class="pill pill-outline"><i class="bi bi-arrow-repeat"></i>Last checked ${fmtDate(opp.lastChecked)}</span>
          </div>
        </div>

        <div class="detail-block" id="eligibility">
          <h2><i class="bi bi-patch-check"></i>Eligibility & AI match explanation</h2>
          <div id="matchBox" class="mb-3"></div>
          <button class="btn-op btn-op-primary btn-op-sm" id="eligBtn"><i class="bi bi-clipboard2-check"></i>Check my eligibility</button>
          <div id="eligBox" class="mt-3"></div>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-gift"></i>Benefits</h2>
          <ul class="detail-list">${opp.benefits.map((b) => `<li><i class="bi bi-check-circle-fill"></i>${esc(b)}</li>`).join("")}</ul>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-signpost-split"></i>Application process</h2>
          <ol class="detail-list" style="counter-reset:step">${opp.process.map((p, i) => `<li><i class="bi bi-${i + 1}-circle" style="color:var(--blue)"></i>${esc(p)}</li>`).join("")}</ol>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-files"></i>Required documents</h2>
          <ul class="detail-list docs">${opp.docs.map((dd) => `<li><i class="bi bi-file-earmark-text"></i>${esc(dd)}</li>`).join("")}</ul>
          <button class="btn-op btn-op-soft btn-op-sm mt-3" id="assistBtn"><i class="bi bi-robot"></i>Open Application Assistant</button>
          <div id="assistBox" class="mt-3"></div>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-calendar3"></i>Important dates</h2>
          <div class="kv-grid">
            <div class="kv"><i class="bi bi-megaphone"></i><div><b>Published</b>${fmtDate(opp.posted)}</div></div>
            <div class="kv"><i class="bi bi-hourglass-split"></i><div><b>Application deadline</b>${fmtDate(opp.deadline)} · ${d.label}</div></div>
            <div class="kv"><i class="bi bi-arrow-repeat"></i><div><b>Last verified by Oppora</b>${fmtDate(opp.lastChecked)}</div></div>
            <div class="kv"><i class="bi bi-person-check"></i><div><b>Decisions expected</b>4–8 weeks after close</div></div>
          </div>
        </div>

        <div class="detail-block">
          <h2><i class="bi bi-question-circle"></i>Frequently asked</h2>
          <div class="accordion accordion-opp" id="faqAcc">
            ${opp.faqs.map((f, i) => `<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq${i}">${esc(f[0])}</button></h2><div id="faq${i}" class="accordion-collapse collapse" data-bs-parent="#faqAcc"><div class="accordion-body" style="font-size:14px">${esc(f[1])}</div></div></div>`).join("")}
          </div>
          <button class="btn-op btn-op-ghost btn-op-sm mt-3" id="reportBtn"><i class="bi bi-flag"></i>Report this opportunity</button>
        </div>
      </div>

      <aside class="opp-detail-aside" style="position:sticky;top:calc(var(--nav-h) + 16px);display:flex;flex-direction:column;gap:16px">
        <div class="panel">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <b style="color:var(--ink)">Apply for this ${cat.singular.toLowerCase()}</b>
            ${deadlinePill(opp)}
          </div>
          <div class="d-flex align-items-center gap-3 mb-3">
            <span id="cdBox" class="deadline-chip ${d.days <= 3 ? "pill-red" : "pill-blue"}" style="background:var(--bg-2);min-width:74px"><b>${Math.max(0, d.days)}</b><span>days left</span></span>
            <div class="small" style="color:var(--muted)">Closes <b style="color:var(--ink)">${fmtDate(opp.deadline)}</b><br><span id="cdLive"></span></div>
          </div>
          <button class="btn-op btn-op-primary btn-op-block" id="applyBtn"><i class="bi bi-send"></i>Apply & track</button>
          <div class="d-flex gap-2 mt-2">
            <button class="save-btn flex-fill justify-content-center ${saved ? "saved" : ""}" data-save="${opp.id}"><i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i>${saved ? "Saved" : "Save"}</button>
            <button class="save-btn flex-fill justify-content-center" id="shareBtn2"><i class="bi bi-share"></i>Share</button>
          </div>
          <p class="small mt-3 mb-0" style="color:var(--faint)"><i class="bi bi-shield-check me-1"></i>Oppora never charges application fees. Report any listing that does.</p>
        </div>
        <div class="panel" id="matchPanel"><div class="panel-head"><h3>Your match</h3></div><div id="matchSide"></div></div>
        <div class="panel"><div class="panel-head"><h3>Similar opportunities</h3></div><div id="similar"></div></div>
      </aside>
    </div>
  </div>`;

  wire();
}

async function wire() {
  const m = await match(opp);
  $("#matchSide").innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-3">${ring(m.score, { size: 86, label: "Match" })}
      <div><b style="color:var(--ink);font-size:15px">${m.score}% match</b><p class="small mb-0" style="color:var(--muted)">${m.band === "high" ? "Strong fit — prioritise this one." : m.band === "mid" ? "Competitive fit with gaps to close." : "Stretch opportunity."}</p></div>
    </div>
    ${m.reasons.map((r) => `<div class="reason-row ok"><i class="bi bi-check-circle-fill"></i>${esc(r.text)}</div>`).join("")}
    ${m.missing.map((r) => `<div class="reason-row miss"><i class="bi bi-dash-circle"></i>${esc(r.text)}</div>`).join("")}
    ${m.concerns.map((r) => `<div class="reason-row warn"><i class="bi bi-exclamation-triangle"></i>${esc(r.text)}</div>`).join("") || ""}`;
  $("#matchBox").innerHTML = `<div class="d-flex flex-wrap gap-2 align-items-center">${matchPill(m.score)}<span class="small" style="color:var(--muted)">Explained line-by-line in the sidebar — we never show a score without reasons.</span></div>`;

  /* Countdown */
  const tick = () => {
    const dd = deadlineInfo(opp);
    if (dd.ms < 0) { $("#cdLive").textContent = "Applications closed"; return; }
    const s = Math.floor(dd.ms / 1000) % 60, mi = Math.floor(dd.ms / 60000) % 60, h = Math.floor(dd.ms / 3600000) % 24;
    $("#cdLive").textContent = `${h}h ${mi}m ${s}s remaining`;
  };
  tick(); setInterval(tick, 1000);

  $("#shareBtn").addEventListener("click", () => shareModal(opp));
  $("#shareBtn2").addEventListener("click", () => shareModal(opp));
  $("#reportBtn").addEventListener("click", () => reportModal(opp));
  $("#applyBtn").addEventListener("click", () => { if (!Store.user()) { location.assign("login.html?next=" + encodeURIComponent("opportunity.html?id=" + opp.id)); return; } applyModal(opp); });

  $("#sumBtn").addEventListener("click", async () => {
    $("#sumBody").innerHTML = `<div class="d-flex gap-2 align-items-center" style="color:var(--muted)"><span class="spinner-border spinner-border-sm"></span> Reading the full listing…</div>`;
    const s = await summarize(opp);
    $("#sumBody").innerHTML = `
      <div class="reason-row ok"><i class="bi bi-1-circle"></i><div><b>What it is.</b> ${esc(s.what)}</div></div>
      <div class="reason-row ok"><i class="bi bi-2-circle"></i><div><b>Who can apply.</b> ${esc(s.who)}</div></div>
      <div class="reason-row ok"><i class="bi bi-3-circle"></i><div><b>Benefits.</b> ${s.benefits.map(esc).join(" · ")}</div></div>
      <div class="reason-row ok"><i class="bi bi-4-circle"></i><div><b>Deadline.</b> ${esc(s.deadline)}</div></div>
      <div class="reason-row ok"><i class="bi bi-5-circle"></i><div><b>Requirements.</b> ${esc(s.requirements)}</div></div>
      <div class="reason-row ok"><i class="bi bi-6-circle"></i><div><b>Documents.</b> ${s.documents.map(esc).join(" · ")}</div></div>
      <div class="reason-row ok"><i class="bi bi-arrow-right-circle"></i><div><b>Next step.</b> ${esc(s.nextStep)}</div></div>`;
  });

  $("#eligBtn").addEventListener("click", async () => {
    if (!Store.user()) { location.assign("login.html?next=" + encodeURIComponent("opportunity.html?id=" + opp.id)); return; }
    $("#eligBox").innerHTML = `<div class="d-flex gap-2 align-items-center small" style="color:var(--muted)"><span class="spinner-border spinner-border-sm"></span> Comparing your Passport with the listing rules…</div>`;
    const e = await eligibility(opp);
    const badge = e.status === "eligible" ? `<span class="pill pill-green"><i class="bi bi-check-circle-fill"></i>Eligible</span>` : e.status === "possible" ? `<span class="pill pill-amber"><i class="bi bi-question-circle"></i>Possibly eligible</span>` : `<span class="pill pill-red"><i class="bi bi-x-circle"></i>Likely not eligible</span>`;
    $("#eligBox").innerHTML = `<div class="ai-panel">${badge}
      ${e.checks.map((c) => `<div class="reason-row ${c.ok === true ? "ok" : c.ok === false ? "warn" : "miss"}"><i class="bi ${c.ok === true ? "check-circle-fill" : c.ok === false ? "x-circle-fill" : "dash-circle"}"></i><div><b>${esc(c.label)}.</b> ${esc(c.detail)}</div></div>`).join("")}
      <p class="small mt-2 mb-0" style="color:var(--muted)">Heuristic pre-check from your Passport. The provider's own criteria always apply.</p></div>`;
  });

  $("#assistBtn").addEventListener("click", async () => {
    if (!Store.user()) { location.assign("login.html?next=" + encodeURIComponent("opportunity.html?id=" + opp.id)); return; }
    $("#assistBox").innerHTML = `<div class="d-flex gap-2 align-items-center small" style="color:var(--muted)"><span class="spinner-border spinner-border-sm"></span> Preparing your application plan…</div>`;
    const a = await assistant(opp);
    $("#assistBox").innerHTML = `<div class="ai-panel">
      <div class="d-flex align-items-center gap-2 mb-2">${matchPill(a.strength)}<span class="small fw-bold" style="color:var(--ink)">Profile strength: ${a.strengthLabel}</span></div>
      <b class="small" style="color:var(--ink)">Documents to prepare</b>
      ${a.docs.map((d) => `<div class="reason-row ${d.ready ? "ok" : "miss"}"><i class="bi ${d.ready ? "check-circle-fill" : "circle"}"></i>${esc(d.name)}${d.ready ? ' <span class="pill pill-green ms-1">likely ready</span>' : ""}</div>`).join("")}
      <b class="small d-block mt-2" style="color:var(--ink)">Questions you may face</b>
      ${a.questions.map((q) => `<div class="reason-row miss"><i class="bi bi-chat-left-quote"></i>${esc(q)}</div>`).join("")}
      <b class="small d-block mt-2" style="color:var(--ink)">Preparation plan</b>
      ${a.prep.map((q) => `<div class="reason-row ok"><i class="bi bi-list-check"></i>${esc(q)}</div>`).join("")}
    </div>`;
  });

  /* Similar */
  const similar = ALL_OPPS.filter((o) => o.id !== opp.id && (o.cat === opp.cat || (o.fields || []).some((f) => (opp.fields || []).includes(f)))).slice(0, 3);
  $("#similar").innerHTML = similar.map((o) => `
    <div class="match-row" style="padding:10px 0">
      ${orgBadge(o, 38)}
      <div class="mr-body"><a class="mr-title" href="opportunity.html?id=${o.id}">${esc(o.title)}</a><span class="mr-sub">${esc(o.org)} · ${deadlineInfo(o).label}</span></div>
    </div>`).join("");
  window.dispatchEvent(new CustomEvent("opp:render"));
}
