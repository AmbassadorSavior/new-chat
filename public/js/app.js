/* ============================================================
   OPPORA — Global bootstrap (runs on every page)
   Injects nav/footer or app shell, wires global interactions:
   save buttons, logout, newsletter, badges, reveal animations.
   ============================================================ */

import { Store } from "./store.js";
import * as UI from "./ui.js";
import * as AI from "./ai.js";
import { getOpp } from "./data.js";
import { saveDemoSubscription } from "./demo.js";

window.OPP_AI = AI;
window.OPP_STORE = Store;

const body = document.body;
const isApp = body.dataset.shell === "app";

/* ---------- Shell injection ---------- */
if (isApp) {
  if (!Store.user()) {
    const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.replace("login.html?next=" + next);
  } else {
    UI.appShell(body.dataset.page);
  }
} else {
  const navHost = document.getElementById("site-nav");
  if (navHost) navHost.outerHTML = UI.renderNav(body.dataset.page);
  const footHost = document.getElementById("site-footer");
  if (footHost) footHost.outerHTML = UI.renderFooter();
}

/* ---------- Navbar scroll state ---------- */
const nav = document.querySelector(".opp-nav");
if (nav) {
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Global save delegation ---------- */
document.addEventListener("click", (e) => {
  const saveBtn = e.target.closest("[data-save]");
  if (saveBtn) {
    e.preventDefault();
    const id = saveBtn.dataset.save;
    const on = Store.toggleSave(id);
    const opp = getOpp(id);
    document.querySelectorAll(`[data-save="${id}"]`).forEach((b) => {
      b.classList.toggle("saved", on);
      b.setAttribute("aria-pressed", String(on));
      b.innerHTML = `<i class="bi ${on ? "bi-bookmark-fill" : "bi-bookmark"}"></i>${on ? "Saved" : "Save"}`;
    });
    if (on) {
      Store.notify({ type: "save", title: "Saved to your list", body: opp ? opp.title : id, link: "saved.html" });
      Store.log(`Saved “${opp?.title || id}”`, "bi-bookmark");
      UI.toast("Saved 💙", opp ? opp.title : "", "success");
    } else {
      UI.toast("Removed from saved", opp ? opp.title : "", "info");
    }
    updateBadges();
    return;
  }
  const logout = e.target.closest("[data-logout]");
  if (logout) {
    e.preventDefault();
    Store.logout();
    UI.toast("Logged out", "See you soon.", "info");
    setTimeout(() => location.assign("index.html"), 350);
  }
});

/* ---------- Badges refresh ---------- */
export function updateBadges() {
  document.querySelectorAll("[data-badge]").forEach((el) => {
    const n = el.dataset.badge === "saved" ? Store.saved().length : el.dataset.badge === "apps" ? Store.apps().length : Store.unreadCount();
    el.textContent = n;
    el.style.display = n ? "" : "none";
  });
}
window.addEventListener("opp:change", updateBadges);

/* ---------- Newsletter (real backend endpoint) ---------- */
document.addEventListener("submit", async (e) => {
  const form = e.target.closest("[data-newsletter]");
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector("input[type=email]");
  const msg = form.parentElement.querySelector("[data-newsletter-msg]");
  const btn = form.querySelector("button");
  const email = input.value.trim();
  const setMsg = (t, ok) => { if (msg) { msg.textContent = t; msg.style.color = ok ? "var(--green)" : "var(--red)"; } };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setMsg("Please enter a valid email address.", false); input.focus(); return; }
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border" role="status" aria-label="Subscribing"></span>`;
  try {
    const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "footer" }) });
    const data = await res.json();
    if (data.ok) { setMsg(data.message, true); form.reset(); UI.toast("Subscribed 📬", "Weekly opportunity updates are on their way."); }
    else throw new Error(data.error || "Subscription failed");
  } catch {
    const data = saveDemoSubscription(email);
    setMsg(data.message, true); form.reset(); UI.toast("Demo subscription saved", "The backend is unavailable, so this is stored locally.", "info");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Subscribe";
  }
});

/* ---------- First-visit prototype notice ---------- */
if (!Store.seenBanner()) {
  Store.setSeenBanner();
  setTimeout(() => UI.toast("Prototype mode", "You're exploring Oppora with a sample dataset — every feature is fully interactive.", "info"), 900);
}

/* ---------- Reveal + rings ---------- */
UI.initReveal();
UI.animateRings();
UI.initBackToTop();
window.addEventListener("opp:render", () => { UI.initReveal(); UI.animateRings(); });
