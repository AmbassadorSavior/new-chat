import "../app.js";
import { $, $$, ring, toast, setGreeting, esc, oppCard, emptyStateHtml } from "../ui.js";
import { Store } from "../store.js";
import { readiness, recommend } from "../ai.js";
import { achievements, chipInput, exportPassport } from "../passport.js";
import { COUNTRIES, CATS } from "../data.js";

setGreeting("Opportunity Passport", "One profile Oppora uses to match, explain and prepare — not a CV, a compass.");

const STATUSES = [["student", "Student"], ["professional", "Working professional"], ["entrepreneur", "Entrepreneur / founder"], ["job-seeker", "Job seeker"]];

function render() {
  const p = Store.passport();
  const r = readiness(p);

  $("#ppHero").innerHTML = `
    <div class="d-flex flex-wrap align-items-center gap-4 position-relative" style="z-index:2">
      ${ring(r.score, { size: 108, label: "Ready" })}
      <div style="flex:1;min-width:240px">
        <span class="pill pill-grad mb-2"><i class="bi bi-passport"></i>Opportunity Passport</span>
        <h1>${esc(p.fullName || "Your Passport")}</h1>
        <p class="mt-1">${esc(p.headline || "Add a one-line headline so partners understand you instantly.")}</p>
        <div class="d-flex flex-wrap gap-3 mt-3 small">
          <span><i class="bi bi-pie-chart me-1" style="color:var(--teal)"></i>${r.completion}% complete</span>
          <span><i class="bi bi-lightning-charge me-1" style="color:var(--teal)"></i>${(p.skills || []).length} skills</span>
          <span><i class="bi bi-geo-alt me-1" style="color:var(--teal)"></i>${esc(p.country || "Country not set")}</span>
          <span><i class="bi bi-clock-history me-1" style="color:var(--teal)"></i>${p.updatedAt ? "Updated " + new Date(p.updatedAt).toLocaleDateString() : "Never updated"}</span>
        </div>
      </div>
      <div class="d-flex flex-column gap-2">
        <button class="btn-op btn-op-primary btn-op-sm" id="exportBtn"><i class="bi bi-download"></i>Export JSON</button>
        <a class="btn-op btn-op-sm" style="background:rgba(255,255,255,.14);color:#fff" href="explore.html?sort=match"><i class="bi bi-bullseye"></i>See my matches</a>
      </div>
    </div>`;
  $("#exportBtn").addEventListener("click", () => { exportPassport(); toast("Passport exported", "oppora-passport.json downloaded.", "info"); });

  /* Section completeness strip */
  $("#ppSections").innerHTML = r.sections.map((s) => `
    <div class="achievement ${s.done ? "" : "locked"}" style="border-color:${s.done ? "var(--line)" : "var(--line-2)"}">
      <span class="ac-ic" style="background:${s.done ? "var(--green-soft)" : "#eef1f6"};color:${s.done ? "var(--green)" : "var(--faint)"}"><i class="bi ${s.done ? "check-circle-fill" : "circle"}"></i></span>
      <div><b style="color:var(--ink);font-size:13.5px">${s.label}</b><div class="small" style="color:var(--muted)">${s.weight}% of completion</div></div>
    </div>`).join("");

  /* Strengths & gaps */
  $("#ppStrengths").innerHTML = (r.strengths.length ? r.strengths.map((s) => `<div class="reason-row ok"><i class="bi bi-check-circle-fill"></i>${esc(s)}</div>`).join("") : `<p class="small" style="color:var(--muted)">Complete more sections to reveal matching strengths.</p>`)
    + (r.missingActions.length ? `<b class="small d-block mt-3 mb-1" style="color:var(--ink)">Recommended actions</b>` + r.missingActions.map((s) => `<div class="reason-row miss"><i class="bi bi-arrow-right-circle"></i><a href="${s.link}">${esc(s.text)}</a></div>`).join("") : `<div class="reason-row ok"><i class="bi bi-trophy"></i>Nothing missing — your Passport is match-ready.</div>`);

  /* Forms */
  $("#formBasics").innerHTML = `
    <div class="row g-3">
      <div class="col-md-6 field mb-0"><label for="fName">Full name</label><input class="input-opp" id="fName" value="${esc(p.fullName)}" placeholder="e.g. Amara Diallo"></div>
      <div class="col-md-6 field mb-0"><label for="fHead">Headline</label><input class="input-opp" id="fHead" value="${esc(p.headline)}" placeholder="Final-year economics student · policy enthusiast"></div>
      <div class="col-md-4 field mb-0"><label for="fCountry">Country</label><select class="select-opp" id="fCountry">${COUNTRIES.map((c) => `<option ${p.country === c ? "selected" : ""}>${c}</option>`).join("")}</select></div>
      <div class="col-md-4 field mb-0"><label for="fCity">City</label><input class="input-opp" id="fCity" value="${esc(p.city)}" placeholder="Lagos"></div>
      <div class="col-md-4 field mb-0"><label for="fStatus">Current status</label><select class="select-opp" id="fStatus"><option value="">Select…</option>${STATUSES.map(([v, l]) => `<option value="${v}" ${p.status === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    </div>
    <button class="btn-op btn-op-primary btn-op-sm mt-3" data-save-section="basics"><i class="bi bi-check2"></i>Save basics</button>`;

  $("#formEducation").innerHTML = `
    <div class="row g-3">
      <div class="col-md-3 field mb-0"><label for="eLevel">Level</label><select class="select-opp" id="eLevel"><option value="">Select…</option>${["Secondary", "Undergraduate", "Postgraduate", "Doctoral"].map((l) => `<option ${p.education?.level === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="col-md-4 field mb-0"><label for="eField">Field of study</label><input class="input-opp" id="eField" value="${esc(p.education?.field)}" placeholder="Computer Science"></div>
      <div class="col-md-3 field mb-0"><label for="eInst">Institution</label><input class="input-opp" id="eInst" value="${esc(p.education?.institution)}" placeholder="University of Lagos"></div>
      <div class="col-md-2 field mb-0"><label for="eGrad">Grad year</label><input class="input-opp" id="eGrad" value="${esc(p.education?.graduation)}" placeholder="2026"></div>
      <div class="col-12 field mb-0"><label class="field-label">Certifications</label><div id="certChips"></div></div>
    </div>
    <button class="btn-op btn-op-primary btn-op-sm mt-3" data-save-section="education"><i class="bi bi-check2"></i>Save education</button>`;

  $("#formSkills").innerHTML = `<label class="field-label">Skills (press Enter to add)</label><div id="skillChips"></div>
    <div class="field mt-3 mb-0"><label for="expBox">Experience</label><textarea class="textarea-opp" id="expBox" rows="3" placeholder="Internships, projects, volunteering, work history…">${esc(p.experience)}</textarea></div>
    <button class="btn-op btn-op-primary btn-op-sm mt-3" data-save-section="skills"><i class="bi bi-check2"></i>Save skills & experience</button>`;

  $("#formInterests").innerHTML = `<label class="field-label">Interests / sectors</label><div id="intChips"></div>
    <div class="row g-3 mt-1">
      <div class="col-md-6 field mb-0"><label for="goalBox">Career goal</label><textarea class="textarea-opp" id="goalBox" rows="2" placeholder="Where do you want to be in 5 years?">${esc(p.careerGoal)}</textarea></div>
      <div class="col-md-6 field mb-0"><label for="entBox">Entrepreneurship goal (optional)</label><textarea class="textarea-opp" id="entBox" rows="2" placeholder="The problem you want to build a business around…">${esc(p.entrepreneurshipGoal)}</textarea></div>
      <div class="col-md-6 field mb-0"><label for="fundBox">Funding need (optional)</label><input class="input-opp" id="fundBox" value="${esc(p.fundingNeed)}" placeholder="e.g. Master's tuition support"></div>
    </div>
    <button class="btn-op btn-op-primary btn-op-sm mt-3" data-save-section="interests"><i class="bi bi-check2"></i>Save interests & goals</button>`;

  $("#formPrefs").innerHTML = `
    <div class="field"><label class="field-label">Opportunity types you follow</label>
      <div class="d-flex flex-wrap gap-2">${Object.entries(CATS).map(([k, c]) => `<button type="button" class="tag-chip ${(p.preferredTypes || []).includes(k) ? "active" : ""}" data-pref-type="${k}"><i class="${c.icon}"></i>${c.label}</button>`).join("")}</div></div>
    <div class="field"><label class="field-label">Work preferences</label>
      <div class="d-flex flex-wrap gap-2">${["remote", "hybrid", "onsite"].map((w) => `<button type="button" class="tag-chip ${(p.workModes || []).includes(w) ? "active" : ""}" data-pref-mode="${w}">${w[0].toUpperCase() + w.slice(1)}</button>`).join("")}</div></div>
    <div class="field mb-0"><label class="field-label">Countries of interest</label><div id="coiChips"></div></div>
    <button class="btn-op btn-op-primary btn-op-sm mt-3" data-save-section="prefs"><i class="bi bi-check2"></i>Save preferences</button>`;

  /* Chip inputs */
  let certs = [...(p.certifications || [])], skills = [...(p.skills || [])], ints = [...(p.interests || [])], cois = [...(p.countriesOfInterest || [])];
  chipInput($("#certChips"), certs, (v) => { certs = v; }, "e.g. AWS Cloud Practitioner");
  chipInput($("#skillChips"), skills, (v) => { skills = v; }, "e.g. Python, Grant writing…");
  chipInput($("#intChips"), ints, (v) => { ints = v; }, "e.g. Fintech, Climate…");
  chipInput($("#coiChips"), cois, (v) => { cois = v; }, "e.g. Kenya, Germany…");

  /* Pref toggles */
  $$("[data-pref-type]").forEach((b) => b.addEventListener("click", () => b.classList.toggle("active")));
  $$("[data-pref-mode]").forEach((b) => b.addEventListener("click", () => b.classList.toggle("active")));

  /* Achievements */
  $("#achGrid").innerHTML = achievements().map((a) => `
    <div class="achievement ${a.done ? "" : "locked"}">
      <span class="ac-ic" style="background:${a.done ? "var(--amber-soft)" : "#eef1f6"};color:${a.done ? "var(--amber)" : "var(--faint)"}"><i class="${a.icon}"></i></span>
      <div><b style="color:var(--ink);font-size:13.5px">${a.label}</b><div class="small" style="color:var(--muted)">${a.desc}</div></div>
      <span class="ms-auto pill ${a.done ? a.cls : "pill-grey"}">${a.done ? "Earned" : "Locked"}</span>
    </div>`).join("");

  /* Section save handlers */
  $$("[data-save-section]").forEach((b) => b.addEventListener("click", () => {
    const s = b.dataset.saveSection;
    if (s === "basics") Store.setPassport({ fullName: $("#fName").value.trim(), headline: $("#fHead").value.trim(), country: $("#fCountry").value, city: $("#fCity").value.trim(), status: $("#fStatus").value });
    if (s === "education") Store.setPassport({ education: { level: $("#eLevel").value, field: $("#eField").value.trim(), institution: $("#eInst").value.trim(), graduation: $("#eGrad").value.trim() }, certifications: certs });
    if (s === "skills") Store.setPassport({ skills, experience: $("#expBox").value.trim() });
    if (s === "interests") Store.setPassport({ interests: ints, careerGoal: $("#goalBox").value.trim(), entrepreneurshipGoal: $("#entBox").value.trim(), fundingNeed: $("#fundBox").value.trim() });
    if (s === "prefs") Store.setPassport({ preferredTypes: $$("[data-pref-type].active").map((x) => x.dataset.prefType), workModes: $$("[data-pref-mode].active").map((x) => x.dataset.prefMode), countriesOfInterest: cois });
    Store.log("Updated Opportunity Passport", "bi-passport");
    toast("Passport updated", "Matching recalculated across all boards.", "success");
    render();
    renderMatches();
  }));

  window.dispatchEvent(new CustomEvent("opp:render"));
}

async function renderMatches() {
  const recs = await recommend(4);
  $("#ppMatches").innerHTML = recs.map(({ opp: o, m }) => oppCard(o, { matchScore: m.score })).join("");
  window.dispatchEvent(new CustomEvent("opp:render"));
}

render();
renderMatches();
window.addEventListener("opp:render", () => {}, { once: true });
