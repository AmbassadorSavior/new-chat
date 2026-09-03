/* ============================================================
   OPPORA — Opportunity Passport helpers
   ============================================================ */

import { Store } from "./store.js";

export function achievements() {
  const p = Store.passport();
  const saved = Store.saved().length;
  const apps = Store.apps().length;
  const { readiness } = window.OPP_AI;
  const r = readiness(p);
  return [
    { icon: "bi-person-badge", label: "Passport opened", desc: "Created your Opportunity Passport", done: !!p.fullName, cls: "pill-blue" },
    { icon: "bi-mortarboard-board", label: "Scholarship ready", desc: "Education details complete", done: r.sections[1].done, cls: "pill-violet" },
    { icon: "bi-lightning-charge", label: "Skill stack", desc: "5+ skills added", done: (p.skills || []).length >= 5, cls: "pill-amber" },
    { icon: "bi-bookmark-heart", label: "Curator", desc: "Saved 3 opportunities", done: saved >= 3, cls: "pill-green" },
    { icon: "bi-send-check", label: "First application", desc: "Tracked an application", done: apps >= 1, cls: "pill-blue" },
    { icon: "bi-trophy", label: "Pipeline builder", desc: "4+ applications in tracker", done: apps >= 4, cls: "pill-amber" },
    { icon: "bi-bullseye", label: "Match master", desc: "Passport readiness 80%+", done: r.score >= 80, cls: "pill-green" },
    { icon: "bi-globe-africa", label: "Borderless", desc: "3+ countries of interest", done: (p.countriesOfInterest || []).length >= 3, cls: "pill-violet" },
  ];
}

/* Chip input component: renders chips + free text entry */
export function chipInput(mount, values, onChange, placeholder = "Type and press Enter") {
  const render = () => {
    mount.innerHTML = `<div class="d-flex flex-wrap gap-2 mb-2" data-chips></div>
      <input class="input-opp" data-chip-entry placeholder="${placeholder}" aria-label="${placeholder}">`;
    const wrap = mount.querySelector("[data-chips]");
    wrap.innerHTML = values.map((v, i) => `<span class="skill-chip">${v}<button type="button" data-i="${i}" aria-label="Remove ${v}"><i class="bi bi-x"></i></button></span>`).join("") || `<span class="small" style="color:var(--faint)">Nothing added yet.</span>`;
    wrap.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { values.splice(+b.dataset.i, 1); onChange([...values]); render(); }));
    const entry = mount.querySelector("[data-chip-entry]");
    entry.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const v = entry.value.trim().replace(/,$/, "");
        if (v && !values.includes(v)) { values.push(v); onChange([...values]); }
        entry.value = "";
        render();
        mount.querySelector("[data-chip-entry]").focus();
      } else if (e.key === "Backspace" && !entry.value && values.length) {
        values.pop(); onChange([...values]); render();
        mount.querySelector("[data-chip-entry]").focus();
      }
    });
  };
  render();
}

export function exportPassport() {
  const data = { exportedAt: new Date().toISOString(), passport: Store.passport(), saved: Store.saved(), applications: Store.apps() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "oppora-passport.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
