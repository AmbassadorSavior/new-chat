import "../app.js";
import { $, $$, oppCard, toast } from "../ui.js";
import { Store } from "../store.js";
import { match, deadlineInfo } from "../ai.js";
import { emptyState, mountListing } from "../search.js";
import { groupsFor, buildPanel, chipList, SORT_OPTS, baseForCat } from "../filters.js";
import { ALL_OPPS, CATS, orgOf } from "../data.js";

const cat = document.body.dataset.cat;
const cfg = CATS[cat];
const base = baseForCat(cat);

/* Hero meta */
$("#catCount").textContent = `${base.length} live demo listings · updated weekly`;

const params = new URLSearchParams(location.search);
const state = emptyState();
state.sort = params.get("sort") || "match";
if (params.get("q")) state.q = params.get("q");

const grid = $("#resultsGrid"), bar = $("#resultsBar"), panel = $("#filterPanel");
const engine = mountListing({ grid, bar, panel, state, baseFilter: (list) => list.filter((o) => o.cat === cat), matchFn: match });

$("#sortSel").innerHTML = SORT_OPTS.map((s) => `<option value="${s.value}" ${state.sort === s.value ? "selected" : ""}>${s.label}</option>`).join("");
$("#sortSel").addEventListener("change", (e) => { state.sort = e.target.value; engine.run({ simulate: false }); });
$("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); state.q = $("#searchInput").value.trim(); refresh(); });

/* Category-specific strips */
function renderStrips() {
  const featured = base.filter((o) => o.featured);
  const featHost = $("#featuredStrip");
  if (featHost) {
    featHost.innerHTML = featured.length ? featured.slice(0, 3).map((o) => oppCard(o, {})).join("") : "";
  }
  const soonHost = $("#closingSoon");
  if (soonHost) {
    const soon = base.map((o) => ({ o, d: deadlineInfo(o) })).filter((x) => x.d.days >= 0).sort((a, b) => a.d.days - b.d.days).slice(0, 4);
    soonHost.innerHTML = soon.map(({ o, d }) => `
      <a class="stat-card text-decoration-none" href="opportunity.html?id=${o.id}">
        <span class="sc-lbl">${d.days === 0 ? "Closes today" : `Closes in ${d.days} days`}</span>
        <b style="color:var(--ink);font-size:14px;line-height:1.3">${o.title}</b>
        <span class="sc-sub" style="color:var(--muted)">${o.org}</span>
      </a>`).join("");
  }
  const provHost = $("#providers");
  if (provHost) {
    const orgs = [...new Set(base.map((o) => o.org))];
    const providerLogos = {
      "Tony Elumelu Foundation": "images/tony elumelu.jpeg",
      "Mastercard Foundation": "images/mastercard.jpeg",
    };
    provHost.innerHTML = orgs.map((o) => {
      const logo = providerLogos[o];
      const visual = logo
        ? `<img class="provider-logo" src="${logo}" alt="${o} logo">`
        : `<span class="org-badge" style="width:20px;height:20px;font-size:9px;background:${orgOf(o).color}">${o.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>${o}`;
      return `<button class="tag-chip" data-org="${o}" aria-label="Filter by ${o}">${visual}</button>`;
    }).join("");
    provHost.querySelectorAll("[data-org]").forEach((b) => b.addEventListener("click", () => {
      state.q = ""; state.orgs = [b.dataset.org];
      toast("Filtered by organisation", b.dataset.org, "info");
      refresh();
      $("#resultsAnchor").scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }
}

function rebuildPanel() { buildPanel(panel, state, groupsFor(cat), base, () => refresh()); }
function refresh() { renderChips(); engine.run({ simulate: false }); }
function renderChips() {
  const chips = chipList(state).concat(state.orgs.map((o) => ({ label: o, fn: () => { state.orgs = []; } })));
  $("#activeChips").innerHTML = chips.map((c, i) => `<button class="achip" data-chip="${i}">${c.label}<i class="bi bi-x"></i></button>`).join("");
  $$("#activeChips [data-chip]").forEach((b) => b.addEventListener("click", () => { chips[+b.dataset.chip].fn(); rebuildPanel(); refresh(); }));
}
window.addEventListener("opp:clearFilters", () => { Object.assign(state, emptyState(), { sort: state.sort }); rebuildPanel(); refresh(); });
$("#filterToggle").addEventListener("click", () => panel.classList.toggle("open"));

renderStrips();
rebuildPanel();
renderChips();
engine.run();
window.dispatchEvent(new CustomEvent("opp:render"));
