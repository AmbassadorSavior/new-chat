import "../app.js";
import { $, $$, toast } from "../ui.js";
import { Store } from "../store.js";
import { match } from "../ai.js";
import { emptyState, mountListing, parseNatural } from "../search.js";
import { groupsFor, buildPanel, chipList, SORT_OPTS, baseForCat } from "../filters.js";
import { ALL_OPPS, CATS } from "../data.js";

const params = new URLSearchParams(location.search);
const state = emptyState();
if (params.get("q")) state.q = params.get("q");
if (params.get("cat") && CATS[params.get("cat")]) state.cats.push(params.get("cat"));
if (params.get("mode")) state.modes.push(params.get("mode"));
if (params.get("deadline")) state.deadline = params.get("deadline");
state.sort = params.get("sort") || "match";

const grid = $("#resultsGrid"), bar = $("#resultsBar"), panel = $("#filterPanel");
const engine = mountListing({ grid, bar, panel, state, matchFn: match });

/* Sort + search controls */
$("#sortSel").innerHTML = SORT_OPTS.map((s) => `<option value="${s.value}" ${state.sort === s.value ? "selected" : ""}>${s.label}</option>`).join("");
$("#sortSel").addEventListener("change", (e) => { state.sort = e.target.value; engine.run({ simulate: false }); });
$("#searchInput").value = state.q;
$("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); state.q = $("#searchInput").value.trim(); refresh(); });

/* Natural-language search */
$("#nlToggle").addEventListener("click", () => {
  const box = $("#nlBox");
  const open = !box.hidden;
  box.hidden = open;
  $("#nlToggle").setAttribute("aria-expanded", String(!open));
  if (!open) $("#nlInput").focus();
});
$("#nlRun").addEventListener("click", () => {
  const text = $("#nlInput").value.trim();
  if (!text) { toast("Type a request first", "Example: “fully funded master's scholarships in Europe for computer science students”", "info"); return; }
  const parsed = parseNatural(text);
  Object.assign(state, { ...parsed, sort: state.sort });
  $("#searchInput").value = state.q;
  rebuildPanel();
  engine.run();
  toast("Parsed your request", (parsed.nlNotes || []).concat(parsed.q ? [`keyword: ${parsed.q}`] : []).join(" · ") || "Filters applied", "info");
});
$$("[data-nl-example]").forEach((b) => b.addEventListener("click", () => { $("#nlInput").value = b.dataset.nlExample; $("#nlRun").click(); }));

/* Filters */
function rebuildPanel() { buildPanel(panel, state, groupsFor(null), ALL_OPPS, () => refresh()); }
function refresh() { renderChips(); engine.run({ simulate: false }); }
function renderChips() {
  const chips = chipList(state);
  $("#activeChips").innerHTML = chips.map((c, i) => `<button class="achip" data-chip="${i}">${c.label}<i class="bi bi-x"></i></button>`).join("") + (chips.length ? `<button class="btn-op btn-op-ghost btn-op-sm" data-clear-all style="padding:4px 10px">Clear all</button>` : "");
  $$("#activeChips [data-chip]").forEach((b) => b.addEventListener("click", () => { chips[+b.dataset.chip].fn(); rebuildPanel(); refresh(); }));
  $("#activeChips [data-clear-all]")?.addEventListener("click", () => window.dispatchEvent(new CustomEvent("opp:clearFilters")));
}
window.addEventListener("opp:clearFilters", () => {
  Object.assign(state, emptyState(), { sort: state.sort });
  $("#searchInput").value = "";
  rebuildPanel(); refresh();
});

/* Mobile filter drawer */
$("#filterToggle").addEventListener("click", () => panel.classList.toggle("open"));

rebuildPanel();
renderChips();
engine.run();
