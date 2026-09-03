import "../app.js";
import { $, $$, esc, timeAgo, emptyStateHtml, toast, setGreeting } from "../ui.js";
import { Store } from "../store.js";

setGreeting("Notifications", "Matches, deadlines and application updates in one feed.");

let tab = "all";

const ICONS = { match: ["bi-bullseye", "var(--green-soft)", "var(--green)"], deadline: ["bi-clock-history", "var(--red-soft)", "var(--red)"], save: ["bi-bookmark", "var(--blue-soft)", "var(--blue)"], application: ["bi-send", "var(--violet-soft)", "var(--violet)"], system: ["bi-stars", "var(--amber-soft)", "var(--amber)"] };

function render() {
  const all = Store.notifs();
  const list = tab === "unread" ? all.filter((n) => !n.read) : all;
  $("#notifTabs").innerHTML = `
    <button class="tag-chip ${tab === "all" ? "active" : ""}" data-tab="all">All (${all.length})</button>
    <button class="tag-chip ${tab === "unread" ? "active" : ""}" data-tab="unread">Unread (${all.filter((n) => !n.read).length})</button>
    <button class="btn-op btn-op-soft btn-op-sm ms-auto" id="markAll" ${all.every((n) => n.read) ? "disabled" : ""}><i class="bi bi-check2-all"></i>Mark all read</button>`;
  $("#notifTabs").querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.tab; render(); }));
  $("#markAll")?.addEventListener("click", () => { Store.markAllNotifs(); toast("All caught up ✨", undefined, "info"); render(); });

  $("#notifList").innerHTML = list.length ? list.map((n) => {
    const [icon, bg, fg] = ICONS[n.type] || ICONS.system;
    return `<div class="notif-item ${n.read ? "" : "unread"}" data-open="${n.id}" role="button" tabindex="0" aria-label="${esc(n.title)}">
      <span class="ni-ic" style="background:${bg};color:${fg}"><i class="${icon}"></i></span>
      <div style="min-width:0">
        <b style="color:var(--ink);font-size:14px">${esc(n.title)}</b>
        <p class="small mt-1" style="color:var(--muted)">${esc(n.body)}</p>
        <span class="small" style="color:var(--faint)">${timeAgo(n.ts)}</span>
      </div>
      ${n.read ? "" : '<span class="ni-dot"></span>'}
    </div>`;
  }).join("") : emptyStateHtml({ icon: "bi-bell-slash", title: tab === "unread" ? "No unread notifications" : "No notifications yet", body: "Deadline alerts, new matches and application updates will land here.", action: '<a class="btn-op btn-op-primary" href="explore.html?sort=match">Find matches</a>' });

  $$("[data-open]").forEach((el) => {
    const go = () => {
      const n = Store.notifs().find((x) => x.id === el.dataset.open);
      Store.markNotif(n.id);
      if (n.link) location.assign(n.link); else render();
    };
    el.addEventListener("click", go);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
}
render();
window.addEventListener("opp:change", render);

$("#app-rail").innerHTML = `
  <div class="panel">
    <div class="panel-head"><h3>Alert preferences</h3></div>
    ${[["emailMatches", "Email me new matches"], ["emailDeadlines", "Deadline reminders (3 days before)"], ["push", "In-app alerts"], ["emailNewsletter", "Weekly digest"]].map(([k, l]) => `
      <div class="form-check form-switch switch-lg d-flex justify-content-between align-items-center py-2">
        <label class="form-check-label fw-semibold" style="font-size:13.5px;color:var(--ink-2)" for="pref-${k}">${l}</label>
        <input class="form-check-input ms-0" type="checkbox" role="switch" id="pref-${k}" data-pref="${k}" ${Store.prefs()[k] ? "checked" : ""}>
      </div>`).join("")}
  </div>`;
$$("[data-pref]").forEach((cb) => cb.addEventListener("change", () => { Store.setPrefs({ [cb.dataset.pref]: cb.checked }); toast("Preference saved", undefined, "info"); }));
window.dispatchEvent(new CustomEvent("opp:render"));
