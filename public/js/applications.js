/* ============================================================
   OPPORA — Application tracker logic + apply flow
   ============================================================ */

import { Store } from "./store.js";
import { toast } from "./ui.js";
import { getOpp } from "./data.js";

export const STAGES = [
  { key: "interested", label: "Interested", icon: "bi-star", cls: "pill-grey" },
  { key: "preparing", label: "Preparing", icon: "bi-pencil-square", cls: "pill-amber" },
  { key: "applied", label: "Applied", icon: "bi-send-check", cls: "pill-blue" },
  { key: "interview", label: "Interview", icon: "bi-camera-video", cls: "pill-violet" },
  { key: "accepted", label: "Accepted", icon: "bi-award", cls: "pill-green" },
  { key: "rejected", label: "Rejected", icon: "bi-x-circle", cls: "pill-red" },
];
export const stageMeta = (key) => STAGES.find((s) => s.key === key) || STAGES[0];

/* ---------- Apply modal ---------- */
export function applyModal(opp) {
  const existing = Store.appFor(opp.id);
  const id = "applyModal";
  let m = document.getElementById(id);
  if (!m) { m = document.createElement("div"); m.id = id; m.className = "modal fade modal-opp"; m.setAttribute("tabindex", "-1"); document.body.appendChild(m); }
  m.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title"><i class="bi bi-send me-2" style="color:var(--blue)"></i>${existing ? "Update application" : "Start your application"}</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
    <div class="modal-body">
      <div class="ai-panel mb-3">
        <div class="ai-head"><span class="ai-logo"><i class="bi bi-stars"></i></span><div><b style="color:var(--ink);font-size:14px">Application Assistant</b><p class="small mb-0" style="color:var(--muted)">Checklist generated from the listing. Oppora tracks your progress — the provider's own portal remains the source of truth.</p></div></div>
        <div class="row g-2">
          ${(opp.docs || []).map((d, i) => `<div class="col-md-6"><label class="filter-check"><input type="checkbox" data-doc="${i}"> ${d}</label></div>`).join("")}
        </div>
      </div>
      <div class="field"><label for="appStatus">Track as</label>
        <select class="select-opp" id="appStatus">
          ${STAGES.map((s) => `<option value="${s.key}" ${s.key === (existing?.status || "applied") ? "selected" : ""}>${s.label}</option>`).join("")}
        </select></div>
      <div class="field"><label for="appNotes">Notes (private)</label><textarea class="textarea-opp" id="appNotes" rows="3" placeholder="e.g. Submitted via provider portal, confirmation #48213…">${existing?.notes || ""}</textarea></div>
      <p class="demo-note mb-0"><i class="bi bi-info-circle"></i>Prototype: applications are tracked locally in your browser. No submission is sent to ${opp.org}.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-op btn-op-ghost btn-op-sm" data-bs-dismiss="modal">Cancel</button>
      <button class="btn-op btn-op-primary btn-op-sm" id="applyConfirm"><i class="bi bi-check2-circle"></i>${existing ? "Save changes" : "Mark as applied & track"}</button>
    </div>
  </div></div>`;
  const bs = new window.bootstrap.Modal(m);
  bs.show();
  m.querySelector("#applyConfirm").addEventListener("click", () => {
    const status = m.querySelector("#appStatus").value;
    const notes = m.querySelector("#appNotes").value.trim();
    const docsChecked = m.querySelectorAll("[data-doc]:checked").length;
    Store.addApp(opp.id, status, notes);
    Store.notify({ type: "application", title: `Application ${status === "applied" ? "submitted" : "updated"}: ${opp.title}`, body: docsChecked ? `${docsChecked} of ${opp.docs.length} documents confirmed ready.` : "Track documents from the Applications board.", link: "applications.html" });
    Store.log(`${status === "applied" ? "Applied to" : "Updated"} “${opp.title}”`, "bi-send");
    bs.hide();
    toast(status === "applied" ? "Application tracked 🎯" : "Application updated", `${opp.org} · status: ${stageMeta(status).label}. Follow it on your Applications board.`);
    window.dispatchEvent(new CustomEvent("opp:change"));
  });
}

export function trackerSummary() {
  const apps = Store.apps();
  return STAGES.map((s) => ({ ...s, count: apps.filter((a) => a.status === s.key).length }));
}

export function appRow(a) {
  const opp = getOpp(a.oppId);
  if (!opp) return "";
  const { orgBadge, fmtDate, deadlinePill, esc } = window.OPP_UI;
  const meta = stageMeta(a.status);
  return `<div class="trk-row" data-app="${a.oppId}">
    <div class="d-flex gap-3 align-items-center" style="min-width:0">
      ${orgBadge(opp, 40)}
      <div style="min-width:0">
        <a href="opportunity.html?id=${opp.id}" class="fw-bold" style="color:var(--ink);font-size:14.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(opp.title)}</a>
        <span class="small" style="color:var(--muted)">${esc(opp.org)} · ${esc(opp.city)}, ${esc(opp.country)}</span>
        ${a.notes ? `<div class="small mt-1" style="color:var(--body-c)"><i class="bi bi-sticky me-1" style="color:var(--amber)"></i>${esc(a.notes)}</div>` : ""}
      </div>
    </div>
    <div class="trk-status"><select class="select-opp status-select w-100" data-status="${a.oppId}" aria-label="Application status">
      ${STAGES.map((s) => `<option value="${s.key}" ${s.key === a.status ? "selected" : ""}>${s.label}</option>`).join("")}
    </select></div>
    <div class="trk-deadline small" style="color:var(--muted)"><i class="bi bi-clock-history me-1"></i>${fmtDate(opp.deadline)}</div>
    <div class="trk-applied small" style="color:var(--muted)"><i class="bi bi-send me-1"></i>${a.appliedAt ? fmtDate(new Date(a.appliedAt).toISOString()) : "—"}</div>
    <div class="trk-actions"><button class="icon-btn" style="width:36px;height:36px" data-notes="${a.oppId}" aria-label="Edit notes"><i class="bi bi-pencil"></i></button></div>
  </div>`;
}

export function notesModal(oppId) {
  const a = Store.appFor(oppId);
  const opp = getOpp(oppId);
  const id = "notesModal";
  let m = document.getElementById(id);
  if (!m) { m = document.createElement("div"); m.id = id; m.className = "modal fade modal-opp"; m.setAttribute("tabindex", "-1"); document.body.appendChild(m); }
  m.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title"><i class="bi bi-sticky me-2" style="color:var(--amber)"></i>Notes — ${opp ? opp.title : ""}</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
    <div class="modal-body"><div class="field"><label for="noteBody">Private notes</label><textarea class="textarea-opp" id="noteBody" rows="4" placeholder="Confirmation numbers, contact person, next steps…">${a?.notes || ""}</textarea></div></div>
    <div class="modal-footer"><button class="btn-op btn-op-ghost btn-op-sm" data-bs-dismiss="modal">Cancel</button><button class="btn-op btn-op-primary btn-op-sm" id="noteSave">Save notes</button></div>
  </div></div>`;
  const bs = new window.bootstrap.Modal(m);
  bs.show();
  m.querySelector("#noteSave").addEventListener("click", () => {
    Store.setAppNotes(oppId, m.querySelector("#noteBody").value.trim());
    bs.hide();
    toast("Notes saved", undefined, "info");
    window.dispatchEvent(new CustomEvent("opp:change"));
  });
}
