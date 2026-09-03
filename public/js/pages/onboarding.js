import "../app.js";
import { $, $$, toast, brandHtml } from "../ui.js";
import { Store } from "../store.js";
import { chipInput } from "../passport.js";
import { COUNTRIES, CATS, FIELDS } from "../data.js";

if (!Store.user()) location.replace("signup.html");

let step = 0;
const draft = { ...Store.passport() };
draft.skills = [...(draft.skills || [])];
draft.interests = [...(draft.interests || [])];
draft.preferredTypes = [...(draft.preferredTypes || [])];
draft.workModes = [...(draft.workModes || [])];
draft.education = { ...(draft.education || {}) };

const STEPS = ["Who you are", "Your education", "Skills & interests", "Goals & preferences"];

function renderSteps() {
  $("#onbSteps").innerHTML = STEPS.map((s, i) => `<div class="os ${i <= step ? "done" : ""}"></div>`).join("");
  $("#onbLabel").textContent = `Step ${step + 1} of 4 — ${STEPS[step]}`;
}

function render() {
  renderSteps();
  const host = $("#onbCard");
  if (step === 0) {
    host.innerHTML = `
      <h2 style="font-size:22px;font-weight:800">Let's start with the basics</h2>
      <p class="mt-2 mb-4" style="color:var(--muted)">Oppora matches opportunities to people, not keywords. This stays on your device in the prototype.</p>
      <div class="field"><label for="oName">Full name</label><input class="input-opp" id="oName" value="${draft.fullName || ""}" placeholder="Your name"></div>
      <div class="row g-3">
        <div class="col-md-6 field mb-0"><label for="oCountry">Country</label><select class="select-opp" id="oCountry"><option value="">Select…</option>${COUNTRIES.map((c) => `<option ${draft.country === c ? "selected" : ""}>${c}</option>`).join("")}</select></div>
        <div class="col-md-6 field mb-0"><label for="oCity">City</label><input class="input-opp" id="oCity" value="${draft.city || ""}" placeholder="City"></div>
      </div>
      <div class="field mt-3"><label class="field-label">I am currently a…</label>
        <div class="d-flex flex-wrap gap-2">${[["student", "Student", "bi-mortarboard-board"], ["professional", "Professional", "bi-briefcase"], ["entrepreneur", "Entrepreneur", "bi-rocket-takeoff"], ["job-seeker", "Job seeker", "bi-search"]].map(([v, l, i]) => `<button type="button" class="tag-chip ${draft.status === v ? "active" : ""}" data-status="${v}"><i class="bi ${i}"></i>${l}</button>`).join("")}</div></div>`;
    $$("[data-status]").forEach((b) => b.addEventListener("click", () => { $$("[data-status]").forEach((x) => x.classList.remove("active")); b.classList.add("active"); draft.status = b.dataset.status; }));
  }
  if (step === 1) {
    host.innerHTML = `
      <h2 style="font-size:22px;font-weight:800">Your education</h2>
      <p class="mt-2 mb-4" style="color:var(--muted)">Scholarships and fellowships filter hard on level and field — get this right and matching gets sharp.</p>
      <div class="row g-3">
        <div class="col-md-4 field mb-0"><label for="oLevel">Highest / current level</label><select class="select-opp" id="oLevel"><option value="">Select…</option>${["Secondary", "Undergraduate", "Postgraduate", "Doctoral"].map((l) => `<option ${draft.education.level === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        <div class="col-md-8 field mb-0"><label for="oField">Field of study</label><select class="select-opp" id="oField"><option value="">Select…</option>${FIELDS.map((f) => `<option ${draft.education.field === f ? "selected" : ""}>${f}</option>`).join("")}</select></div>
        <div class="col-md-8 field mb-0"><label for="oInst">Institution</label><input class="input-opp" id="oInst" value="${draft.education.institution || ""}" placeholder="University / school"></div>
        <div class="col-md-4 field mb-0"><label for="oGrad">Graduation year</label><input class="input-opp" id="oGrad" value="${draft.education.graduation || ""}" placeholder="2026"></div>
      </div>`;
  }
  if (step === 2) {
    host.innerHTML = `
      <h2 style="font-size:22px;font-weight:800">Skills & interests</h2>
      <p class="mt-2 mb-4" style="color:var(--muted)">Add at least three skills — match scores use them directly.</p>
      <div class="field"><label class="field-label">Skills</label><div id="oSkills"></div></div>
      <div class="field mb-0"><label class="field-label">Interests / sectors</label><div id="oInterests"></div></div>`;
    chipInput($("#oSkills"), draft.skills, (v) => { draft.skills = v; });
    chipInput($("#oInterests"), draft.interests, (v) => { draft.interests = v; });
  }
  if (step === 3) {
    host.innerHTML = `
      <h2 style="font-size:22px;font-weight:800">Goals & preferences</h2>
      <p class="mt-2 mb-4" style="color:var(--muted)">Last step — this shapes your dashboard from day one.</p>
      <div class="field"><label class="field-label">Opportunity types to follow</label>
        <div class="d-flex flex-wrap gap-2">${Object.entries(CATS).slice(0, 8).map(([k, c]) => `<button type="button" class="tag-chip ${draft.preferredTypes.includes(k) ? "active" : ""}" data-type="${k}"><i class="${c.icon}"></i>${c.label}</button>`).join("")}</div></div>
      <div class="field"><label class="field-label">Work style</label>
        <div class="d-flex flex-wrap gap-2">${["remote", "hybrid", "onsite"].map((w) => `<button type="button" class="tag-chip ${draft.workModes.includes(w) ? "active" : ""}" data-mode="${w}">${w}</button>`).join("")}</div></div>
      <div class="field"><label for="oGoal">Career goal (one line)</label><textarea class="textarea-opp" id="oGoal" rows="2" placeholder="e.g. Build data infrastructure for African financial markets">${draft.careerGoal || ""}</textarea></div>`;
    $$("[data-type]").forEach((b) => b.addEventListener("click", () => { b.classList.toggle("active"); const k = b.dataset.type; draft.preferredTypes = b.classList.contains("active") ? [...draft.preferredTypes, k] : draft.preferredTypes.filter((x) => x !== k); }));
    $$("[data-mode]").forEach((b) => b.addEventListener("click", () => { b.classList.toggle("active"); const k = b.dataset.mode; draft.workModes = b.classList.contains("active") ? [...draft.workModes, k] : draft.workModes.filter((x) => x !== k); }));
  }

  $("#prevBtn").style.visibility = step === 0 ? "hidden" : "visible";
  $("#nextBtn").innerHTML = step === 3 ? '<i class="bi bi-check2-circle"></i>Finish & open dashboard' : 'Continue <i class="bi bi-arrow-right"></i>';
}

function collect() {
  if (step === 0) { draft.fullName = $("#oName").value.trim(); draft.country = $("#oCountry").value; draft.city = $("#oCity").value.trim(); }
  if (step === 1) { draft.education = { level: $("#oLevel").value, field: $("#oField").value, institution: $("#oInst").value.trim(), graduation: $("#oGrad").value.trim() }; }
  if (step === 3) { draft.careerGoal = $("#oGoal").value.trim(); }
}

$("#nextBtn").addEventListener("click", () => {
  collect();
  if (step === 0 && (!draft.fullName || !draft.country)) { toast("Almost there", "Name and country are needed for matching.", "error"); return; }
  if (step === 2 && draft.skills.length < 3) { toast("Add 3+ skills", "Match scores rely on your skill list.", "error"); return; }
  if (step < 3) { step++; render(); return; }
  Store.setPassport(draft);
  Store.log("Completed onboarding", "bi-flag");
  Store.notify({ type: "system", title: "Passport created ✅", body: "Your matches are ready on the dashboard.", link: "dashboard.html" });
  toast("You're set 🎉", "Your dashboard is now personalized.");
  setTimeout(() => location.assign("dashboard.html"), 600);
});
$("#prevBtn").addEventListener("click", () => { if (step > 0) { collect(); step--; render(); } });
$("#skipBtn").addEventListener("click", () => { Store.setPassport(draft); location.assign("dashboard.html"); });

$("#onbBrand").innerHTML = brandHtml(28);
render();
