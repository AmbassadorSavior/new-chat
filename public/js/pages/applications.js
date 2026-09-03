import "../app.js";
import { $, emptyStateHtml, toast, setGreeting, greetWord, railPassportCard } from "../ui.js";
import { Store } from "../store.js";
import { STAGES, trackerSummary, appRow, notesModal } from "../applications.js";
import { getOpp } from "../data.js";

setGreeting("Applications tracker", "Move opportunities through your pipeline — from interest to decision.");

let filter = "all";

function render() {
  const summary = trackerSummary();
  $("#pipeline").innerHTML = `
    <button class="pipe-cell ${filter === "all" ? "active" : ""}" data-f="all"><span class="pc-l"><i class="bi bi-layers"></i>All</span><span class="pc-n">${Store.apps().length}</span></button>
    ${summary.map((s) => `<button class="pipe-cell ${filter === s.key ? "active" : ""}" data-f="${s.key}"><span class="pc-l"><i class="${s.icon}"></i>${s.label}</span><span class="pc-n">${s.count}</span></button>`).join("")}`;
  $("#pipeline").querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; render(); }));

  const apps = Store.apps().filter((a) => filter === "all" || a.status === filter);
  const host = $("#trkList");
  if (!apps.length) {
    host.innerHTML = emptyStateHtml({ icon: "bi-kanban", title: filter === "all" ? "No applications yet" : `Nothing in “${STAGES.find((s) => s.key === filter)?.label}”`, body: "When you apply — or mark an opportunity as preparing — it appears here with deadlines, status and private notes.", action: '<a class="btn-op btn-op-primary" href="explore.html?sort=match">Find your first match</a>' });
    return;
  }
  host.innerHTML = apps.map(appRow).join("");

  host.querySelectorAll("[data-status]").forEach((sel) => sel.addEventListener("change", (e) => {
    const id = sel.dataset.status;
    Store.setAppStatus(id, e.target.value);
    const opp = getOpp(id);
    Store.log(`Moved “${opp?.title}” to ${e.target.selectedOptions[0].textContent}`, "bi-arrow-repeat");
    toast("Status updated", `${opp?.title} → ${e.target.selectedOptions[0].textContent}`, "info");
    render();
  }));
  host.querySelectorAll("[data-notes]").forEach((b) => b.addEventListener("click", () => notesModal(b.dataset.notes)));
}
render();
window.addEventListener("opp:change", () => { /* pipeline counts refresh on next render */ });

$("#app-rail").innerHTML = railPassportCard() + `
  <div class="panel">
    <div class="panel-head"><h3>Pipeline tips</h3></div>
    <div class="reason-row ok"><i class="bi bi-1-circle"></i>Keep “Preparing” under 5 days — momentum beats perfection.</div>
    <div class="reason-row ok"><i class="bi bi-2-circle"></i>Log confirmation numbers in notes the moment you submit.</div>
    <div class="reason-row ok"><i class="bi bi-3-circle"></i>Follow up 10 days after applying; Oppora reminds you on the deadlines rail.</div>
  </div>`;
window.dispatchEvent(new CustomEvent("opp:render"));
