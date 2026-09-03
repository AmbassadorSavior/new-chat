/* ============================================================
   OPPORA — Filter panel builder (shared by Explore + categories)
   ============================================================ */

import { COUNTRIES, FIELDS, LEVELS, CATS, ALL_OPPS } from "./data.js";

const MODE_LABEL = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };
const FUND_LABEL = { fully: "Fully funded", partial: "Partial funding", salary: "Salary", stipend: "Stipend", prize: "Prize / seed capital", unpaid: "Unpaid / sponsored" };
const DEADLINE_OPTS = [
  { value: "", label: "Any deadline" },
  { value: "week", label: "Closing this week" },
  { value: "month", label: "Closing this month" },
  { value: "open", label: "Still open" },
  { value: "passed", label: "Deadline passed" },
];

export function groupsFor(cat) {
  const g = [
    { key: "countries", title: "Country", icon: "bi-geo-alt", options: COUNTRIES.map((c) => ({ value: c, label: c })) },
    { key: "modes", title: "Work mode", icon: "bi-briefcase", options: Object.entries(MODE_LABEL).map(([value, label]) => ({ value, label })) },
    { key: "levels", title: "Education level", icon: "bi-mortarboard-board", options: LEVELS.map((l) => ({ value: l, label: l })) },
    { key: "fields", title: "Field / sector", icon: "bi-diagram-3", options: FIELDS.map((f) => ({ value: f, label: f })) },
    { key: "funding", title: "Funding type", icon: "bi-cash-coin", options: Object.entries(FUND_LABEL).map(([value, label]) => ({ value, label })) },
  ];
  if (cat === "grant") g.splice(2, 0, { key: "tags", title: "Grant category", icon: "bi-tags", options: ["Startup funding", "Youth funding", "Innovation", "NGO / community", "Research", "Women-focused", "Entrepreneurship", "Social impact"].map((t) => ({ value: t, label: t })) });
  if (cat === "job" || cat === "remote") g.splice(2, 0, { key: "tags", title: "Seniority & contract", icon: "bi-tags", options: ["Full-time", "Contract", "Graduate"].map((t) => ({ value: t, label: t })) });
  return g;
}

export function buildPanel(mount, state, groups, baseList, onChange) {
  const counts = (key, value) => baseList.filter((o) => (key === "modes" ? o.workMode === value : key === "tags" ? (o.tags || []).includes(value) : key === "fields" ? (o.fields || []).includes(value) : key === "funding" ? o.funding.kind === value : key === "levels" ? o.level === value : o.country === value)).length;
  mount.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-2">
      <b style="color:var(--ink);font-size:14px"><i class="bi bi-funnel me-2" style="color:var(--blue)"></i>Filters</b>
      <button class="btn-op btn-op-ghost btn-op-sm" data-reset-filters style="padding:6px 10px"><i class="bi bi-arrow-counterclockwise"></i>Reset</button>
    </div>
    ${groups.map((g) => `
      <div class="filter-group">
        <div class="fg-title"><i class="${g.icon.startsWith("bi-") ? g.icon : `bi-${g.icon}`}"></i>${g.title}</div>
        ${g.options.map((o) => `
          <label class="filter-check"><input type="checkbox" data-group="${g.key}" value="${o.value}" ${state[g.key].includes(o.value) ? "checked" : ""}>
          <span>${o.label}</span><span class="cnt">${counts(g.key, o.value)}</span></label>`).join("")}
      </div>`).join("")}
    <div class="filter-group">
      <div class="fg-title"><i class="bi bi-clock-history"></i>Deadline</div>
      <select class="select-opp" data-deadline aria-label="Deadline filter">${DEADLINE_OPTS.map((d) => `<option value="${d.value}" ${state.deadline === d.value ? "selected" : ""}>${d.label}</option>`).join("")}</select>
    </div>`;
  mount.querySelectorAll("input[type=checkbox][data-group]").forEach((cb) => cb.addEventListener("change", () => {
    const arr = state[cb.dataset.group];
    if (cb.checked) { if (!arr.includes(cb.value)) arr.push(cb.value); }
    else state[cb.dataset.group] = arr.filter((v) => v !== cb.value);
    onChange();
  }));
  mount.querySelector("[data-deadline]").addEventListener("change", (e) => { state.deadline = e.target.value; onChange(); });
  mount.querySelector("[data-reset-filters]").addEventListener("click", () => window.dispatchEvent(new CustomEvent("opp:clearFilters")));
}

export function chipList(state) {
  const chips = [];
  const push = (label, fn) => chips.push({ label, fn });
  if (state.q) push(`“${state.q}”`, () => { state.q = ""; });
  state.cats.forEach((c) => push(CATS[c]?.label || c, () => { state.cats = state.cats.filter((x) => x !== c); }));
  state.countries.forEach((c) => push(c, () => { state.countries = state.countries.filter((x) => x !== c); }));
  state.modes.forEach((m) => push(MODE_LABEL[m], () => { state.modes = state.modes.filter((x) => x !== m); }));
  state.levels.forEach((l) => push(l, () => { state.levels = state.levels.filter((x) => x !== l); }));
  state.fields.forEach((f) => push(f, () => { state.fields = state.fields.filter((x) => x !== f); }));
  state.funding.forEach((f) => push(FUND_LABEL[f], () => { state.funding = state.funding.filter((x) => x !== f); }));
  state.tags.forEach((t) => push(t, () => { state.tags = state.tags.filter((x) => x !== t); }));
  if (state.deadline) push(DEADLINE_OPTS.find((d) => d.value === state.deadline)?.label || state.deadline, () => { state.deadline = ""; });
  return chips;
}

export const SORT_OPTS = [
  { value: "match", label: "Best match" },
  { value: "closing", label: "Closing soon" },
  { value: "newest", label: "Newly added" },
  { value: "funding", label: "Funding / salary" },
  { value: "title", label: "A – Z" },
];

export function baseForCat(cat) { return cat ? ALL_OPPS.filter((o) => o.cat === cat) : ALL_OPPS; }
