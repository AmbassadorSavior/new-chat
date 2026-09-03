/* ============================================================
   OPPORA — Shared UI kit (nav, footer, shell, cards, feedback)
   ============================================================ */

import { Store } from "./store.js";
import { CATS, ORGS, orgOf, catOf, ALL_OPPS } from "./data.js";
import { deadlineInfo } from "./ai.js";

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const iconClass = (icon) => String(icon || "bi-circle").startsWith("bi-") ? String(icon || "bi-circle") : `bi-${icon}`;
const ORG_LOGOS = {
  Google: "images/google.jpeg",
  "Google.org": "images/google.jpeg",
  "Chevening / UK FCDO": "images/chevenin.jpeg",
  "Tony Elumelu Foundation": "images/tony elumelu.jpeg",
  Flutterwave: "images/flutterwave.jpeg",
  "Mastercard Foundation": "images/mastercard.jpeg",
  Paystack: "images/paystack2.png",
  AGRA: "images/agra.jpeg",
  "African Development Bank": "images/african dev bank.jpeg",
  "Rockefeller Foundation": "images/rockfeller.jpeg",
  Seedstars: "images/seedar.jpeg",
  DAAD: "images/Daad.jpeg",
  "Mandela Rhodes Foundation": "images/mandela.jpeg",
  "African Leadership University": "images/africa leader.jpeg",
  "Erasmus+ / EU": "images/erasmus.jpeg",
  "British Council": "images/british2.jpeg",
  "M-KOPA": "images/m-kopa.jpeg",
  "Wellcome Trust": "images/welltrust.jpeg",
  "Microsoft Africa": "images/afric.jpeg",
};

/* ---------- Brand ---------- */
export function logoMark(size = 30) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="oppg${size}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6bff"/><stop offset=".55" stop-color="#0aa6c9"/><stop offset="1" stop-color="#00c9a7"/></linearGradient></defs><path fill="url(#oppg${size})" d="M32 2C15.4 2 2 15.4 2 32c0 12.9 8.2 23.9 19.6 28.1 2.5.9 4.4-.6 4.4-2.7 0-1.5-.5-2.6-1.2-4.3C20.6 49.4 16 41.3 16 32 16 23.2 23.2 16 32 16s16 7.2 16 16c0 9.3-4.6 17.4-8.8 21.1-.7 1.7-1.2 2.8-1.2 4.3 0 2.1 1.9 3.6 4.4 2.7C53.8 55.9 62 44.9 62 32 62 15.4 48.6 2 32 2z"/><path fill="url(#oppg${size})" d="M25.9 47.6c-1.7 2.6-2.9 5.5-3.5 8.6 2.9 1.1 6.1 1.8 9.6 1.8s6.7-.7 9.6-1.8c-.6-3.1-1.8-6-3.5-8.6-1.9 1-4 1.6-6.1 1.6s-4.2-.6-6.1-1.6z" opacity=".9"/></svg>`;
}
export const brandHtml = (size = 30) => `<span class="brand">${logoMark(size)}<span class="brand-word">oppora</span></span>`;

export const initials = (name = "?") => name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/* ---------- Dates ---------- */
export const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  return d < 30 ? d + "d ago" : Math.floor(d / 30) + "mo ago";
}

/* ---------- Pills & badges ---------- */
export function matchPill(score) {
  if (score == null) return "";
  const band = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
  return `<span class="match-pill ${band}" title="Explained on the opportunity page"><i class="bi bi-bullseye"></i>${score}% match</span>`;
}
export function deadlinePill(opp) {
  const d = deadlineInfo(opp);
  const cls = d.bucket === "passed" ? "pill-grey" : d.bucket === "today" || d.bucket === "3days" ? "pill-red" : d.bucket === "week" ? "pill-amber" : "pill-blue";
  const icon = d.bucket === "passed" ? "bi-x-circle" : "bi-clock-history";
  return `<span class="pill ${cls}"><i class="${icon}"></i>${d.bucket === "passed" ? "Closed" : fmtDate(opp.deadline)}</span>`;
}
export function orgBadge(opp, size = 44) {
  const o = orgOf(opp.org);
  const logoName = opp.org.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const logoSrc = ORG_LOGOS[opp.org] || `assets/logos/${logoName}.svg`;
  const logoOnly = ["Chevening / UK FCDO", "Tony Elumelu Foundation", "Google", "Google.org", "Flutterwave", "Mastercard Foundation", "Paystack", "AGRA", "African Development Bank", "Rockefeller Foundation", "Seedstars", "DAAD", "Mandela Rhodes Foundation", "African Leadership University", "Erasmus+ / EU", "British Council", "M-KOPA", "Wellcome Trust", "Microsoft Africa"].includes(opp.org) ? " logo-only" : "";
  return `<span class="org-badge${logoOnly}" style="background:${o.color};width:${size}px;height:${size}px;font-size:${Math.round(size * 0.32)}px" aria-label="${esc(opp.org)} logo">
    <img class="org-logo" src="${logoSrc}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false;this.closest('.org-badge').classList.remove('logo-only')">
    <span class="org-initials">${initials(opp.org)}</span>
  </span>`;
}
export const verifiedTag = (opp) => opp.verified ? `<i class="bi bi-patch-check-fill" title="Verified organisation (demo dataset)"></i>` : "";

/* ---------- Opportunity card ---------- */
export function oppCard(opp, { matchScore = null, showStatus = false } = {}) {
  const cat = catOf(opp.cat);
  const saved = Store.isSaved(opp.id);
  const app = Store.appFor(opp.id);
  const d = deadlineInfo(opp);
  const statusHtml = app ? `<span class="pill pill-violet"><i class="bi bi-kanban"></i>${cap(app.status)}</span>` : "";
  return `
  <article class="opp-card" data-opp="${opp.id}">
    <div class="oc-top">
      ${orgBadge(opp)}
      <div style="min-width:0;flex:1">
        <div class="oc-org">${esc(opp.org)} ${verifiedTag(opp)}</div>
        <h3 class="oc-title"><a href="opportunity.html?id=${opp.id}">${esc(opp.title)}</a></h3>
      </div>
      ${matchPill(matchScore)}
    </div>
    <p class="oc-desc">${esc(opp.desc)}</p>
    <div class="oc-meta">
      <span><i class="bi bi-geo-alt"></i>${esc(opp.city)}, ${esc(opp.country)}</span>
      <span><i class="bi bi-${opp.workMode === "remote" ? "globe2" : opp.workMode === "hybrid" ? "arrow-left-right" : "building"}"></i>${cap(opp.workMode)}</span>
      <span><i class="bi bi-cash-coin"></i>${esc(opp.funding.label)}</span>
    </div>
    <div class="oc-tags">
      <span class="pill pill-grey"><i class="${iconClass(cat.icon)}"></i>${cat.singular}</span>
      <span class="pill ${d.bucket === "passed" ? "pill-grey" : d.bucket === "today" || d.bucket === "3days" ? "pill-red" : d.bucket === "week" ? "pill-amber" : "pill-outline"}"><i class="bi bi-clock-history"></i>${d.bucket === "passed" ? "Closed" : d.label}</span>
      ${statusHtml}
    </div>
    <div class="oc-foot">
      <button class="save-btn ${saved ? "saved" : ""}" data-save="${opp.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove from saved" : "Save opportunity"}">
        <i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i>${saved ? "Saved" : "Save"}
      </button>
      <a class="btn-op btn-op-soft btn-op-sm" href="opportunity.html?id=${opp.id}">View <i class="bi bi-arrow-right"></i></a>
      ${showStatus && app ? `<span class="small ms-auto" style="color:var(--muted)">Updated ${timeAgo(app.updatedAt)}</span>` : ""}
    </div>
  </article>`;
}
const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

export function catCard(key, count) {
  const c = CATS[key];
  return `<a class="cat-card" href="${c.page}" data-reveal>
    <img src="${c.image}" alt="${c.label} in Africa" loading="lazy">
    <div class="cc-body">
      <span class="cc-icon"><i class="${iconClass(c.icon)}"></i></span>
      <div class="cc-t">${c.label} <i class="bi bi-arrow-right"></i></div>
      <div class="cc-n">${count.toLocaleString()} opportunities</div>
    </div>
  </a>`;
}

export function emptyStateHtml({ icon = "bi-inbox", title = "Nothing here yet", body = "", action = "" }) {
  return `<div class="empty-state"><div class="es-icon"><i class="${iconClass(icon)}"></i></div><h3>${title}</h3><p>${body}</p>${action}</div>`;
}

/* ---------- Ring ---------- */
export function ring(percent, { size = 92, stroke = 9, label = "Ready", color = "url(#ringGrad)" } = {}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, percent)) / 100) * c;
  return `<span class="ring-wrap" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${percent} percent">
      <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6bff"/><stop offset="1" stop-color="#00c9a7"/></linearGradient></defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#e6ecf5" stroke-width="${stroke}"/>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-ring-off="${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>
    <span class="ring-label"><b>${percent}%</b><span>${label}</span></span>
  </span>`;
}
export function animateRings(root = document) {
  $$(".ring-fg", root).forEach((el) => requestAnimationFrame(() => { el.style.strokeDashoffset = el.dataset.ringOff; }));
}

/* ---------- Toasts ---------- */
export function toast(title, body = "", type = "success") {
  let stack = $(".toast-stack");
  if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; stack.setAttribute("role", "status"); document.body.appendChild(stack); }
  const icons = { success: "bi-check-circle-fill", error: "bi-exclamation-triangle-fill", info: "bi-info-circle-fill" };
  const el = document.createElement("div");
  el.className = `opp-toast ${type}`;
  el.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i><div class="tt"><b>${esc(title)}</b>${body ? `<span>${esc(body)}</span>` : ""}</div><button aria-label="Dismiss"><i class="bi bi-x"></i></button>`;
  stack.appendChild(el);
  const kill = () => { el.classList.add("leaving"); setTimeout(() => el.remove(), 320); };
  el.querySelector("button").addEventListener("click", kill);
  setTimeout(kill, 4600);
}

/* ---------- Reveal + counters ---------- */
export function initReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$("[data-reveal]").forEach((el) => io.observe(el));
  const io2 = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io2.unobserve(e.target);
    const target = parseFloat(e.target.dataset.count);
    const suf = e.target.dataset.suffix || "";
    const t0 = performance.now(), dur = 1200;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      e.target.textContent = v.toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.4 });
  $$("[data-count]").forEach((el) => io2.observe(el));
}

/* ---------- Back to top ---------- */
export function initBackToTop() {
  if (document.querySelector("[data-back-to-top]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.dataset.backToTop = "";
  button.setAttribute("aria-label", "Back to top");
  button.title = "Back to top";
  button.innerHTML = '<i class="bi bi-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(button);

  const update = () => button.classList.toggle("visible", window.scrollY > 360);
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Public navbar ---------- */
const NAV_LINKS = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "explore.html", label: "Explore", key: "explore", dropdown: true },
  { href: "scholarships.html", label: "Scholarships", key: "scholarship" },
  { href: "jobs.html", label: "Jobs", key: "job" },
  { href: "grants.html", label: "Grants", key: "grant" },
  { href: "internships.html", label: "Internships", key: "internship" },
  { href: "competitions.html", label: "Competitions", key: "competition" },
  { href: "about.html", label: "About", key: "about" },
];
export function renderNav(active) {
  const user = Store.user();
  const dropdownItems = Object.entries(CATS).map(([k, c]) => `
    <div class="mega-category">
      <a class="mega-category-head" href="${c.page}"><span class="mega-icon"><i class="${iconClass(c.icon)}"></i></span><span><b>${c.label}</b><small>${c.blurb.split(".")[0]}.</small></span></a>
      <a class="mega-category-link" href="${c.page}">Explore ${c.label} <i class="bi bi-arrow-right"></i></a>
    </div>`).join("");
  const megaAccountActions = "";
  const auth = `
    <a class="btn-op btn-op-ghost btn-op-sm" href="login.html">Log in</a>
    <a class="btn-op btn-op-primary btn-op-sm" href="signup.html">Create free account</a>`;

  return `
  <nav class="opp-nav" aria-label="Primary">
    <div class="container-opp nav-inner">
      <a href="index.html" aria-label="Oppora home">${brandHtml()}</a>
      <ul class="nav-links">
        ${NAV_LINKS.map((l) => l.dropdown ? `
          <li class="dropdown ${active === l.key ? "active" : ""}">
            <button class="dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">${l.label} <i class="bi bi-chevron-down" style="font-size:10px"></i></button>
            <div class="dropdown-menu nav-dropdown-menu mega-menu">
              <aside class="mega-intro"><span class="mega-intro-mark"><i class="bi bi-grid-3x3-gap"></i></span><h2>Explore endless <strong>opportunities.</strong></h2><p>Browse a wide range of opportunities to learn, grow, contribute and achieve your goals.</p><div class="mega-actions"><a class="btn-op btn-op-primary btn-op-sm" href="explore.html">View all opportunities <i class="bi bi-arrow-right"></i></a>${megaAccountActions}</div></aside>
              <div class="mega-grid">${dropdownItems}</div>
              <a class="mega-all" href="explore.html">All opportunities <i class="bi bi-arrow-right"></i></a>
            </div>
          </li>` : `<li class="${active === l.key ? "active" : ""}"><a href="${l.href}">${l.label}</a></li>`).join("")}
      </ul>
      <div class="nav-cta">
        ${auth}
        <button class="icon-btn nav-burger" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-label="Open menu"><i class="bi bi-list"></i></button>
      </div>
    </div>
  </nav>
  <div class="offcanvas offcanvas-end mobile-nav" tabindex="-1" id="mobileNav" aria-labelledby="mobileNavLabel">
    <div class="offcanvas-header">
      <span id="mobileNavLabel">${brandHtml(26)}</span>
      <button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      ${NAV_LINKS.map((l) => `<a class="m-link ${active === l.key ? "active" : ""}" href="${l.href}"><i class="${iconClass(l.key === "home" ? "bi-house" : l.key === "about" ? "bi-info-circle" : (CATS[l.key]?.icon || "bi-grid-3x3-gap"))}"></i>${l.label}</a>`).join("")}
      <a class="m-link" href="fellowships.html"><i class="bi bi-award"></i>Fellowships</a>
      <a class="m-link" href="remote-work.html"><i class="bi bi-globe2"></i>Remote Work</a>
      <a class="m-link" href="volunteer.html"><i class="bi bi-heart"></i>Volunteer</a>
      <hr>
      <div class="d-grid gap-2 mt-2"><a class="btn-op btn-op-primary" href="signup.html">Create free account</a><a class="btn-op btn-op-outline" href="login.html">Log in</a></div>
    </div>
  </div>`;
}

/* ---------- Footer ---------- */
export function renderFooter() {
  return `
  <footer class="opp-footer">
    <div class="container-opp">
      <div class="ft-grid">
        <div class="ft-brand">
          <a href="index.html" aria-label="Oppora home">${brandHtml(30)}</a>
          <p class="ft-blurb">Oppora is Africa's opportunity-discovery platform — helping you find, qualify for, prepare for and track scholarships, jobs, grants, internships, fellowships and competitions.</p>
          <div class="social-row">
            <a href="about.html#contact" aria-label="Oppora on X"><i class="bi bi-twitter-x"></i></a>
            <a href="about.html#contact" aria-label="Oppora on LinkedIn"><i class="bi bi-linkedin"></i></a>
            <a href="about.html#contact" aria-label="Oppora on Instagram"><i class="bi bi-instagram"></i></a>
            <a href="about.html#contact" aria-label="Oppora on YouTube"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
        <div>
          <h4>Platform</h4>
          <ul>
            <li><a href="explore.html">Explore opportunities</a></li>
            <li><a href="scholarships.html">Scholarships</a></li>
            <li><a href="jobs.html">Jobs</a></li>
            <li><a href="grants.html">Grants</a></li>
            <li><a href="internships.html">Internships</a></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><a href="index.html#how">How Oppora works</a></li>
            <li><a href="passport.html">Opportunity Passport</a></li>
            <li><a href="about.html#stories">Success stories</a></li>
            <li><a href="about.html#help">Help center</a></li>
            <li><a href="about.html#faq">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="about.html#mission">About us</a></li>
            <li><a href="about.html#verification">Trust & verification</a></li>
            <li><a href="about.html#contact">Contact</a></li>
            <li><a href="about.html#privacy">Privacy</a></li>
            <li><a href="about.html#terms">Terms</a></li>
          </ul>
        </div>
        <div>
          <h4>Stay connected</h4>
          <p class="small" style="color:var(--muted)">One email a week: new verified opportunities matched to your Passport. No spam.</p>
          <form class="newsletter-form" data-newsletter novalidate>
            <label class="visually-hidden" for="nlEmail">Email address</label>
            <input class="input-opp" id="nlEmail" type="email" placeholder="Email address" required>
            <button class="btn-op btn-op-primary" type="submit">Subscribe</button>
          </form>
          <p class="small mt-2" data-newsletter-msg style="min-height:18px"></p>
        </div>
      </div>
      <div class="ft-bottom">
        <span>© 2026 Oppora. Demo dataset — opportunities shown are samples, not live listings.</span>
        <span class="ft-links">
          <a href="about.html#privacy">Privacy Policy</a>
          <a href="about.html#terms">Terms of Service</a>
          <a href="about.html#cookies">Cookie Policy</a>
        </span>
      </div>
    </div>
  </footer>`;
}

/* ---------- App shell (authenticated pages) ---------- */
const SIDE = [
  { key: "dashboard", href: "dashboard.html", icon: "bi-grid-1x2", label: "Dashboard" },
  { key: "explore", href: "explore.html", icon: "bi-compass", label: "Explore Opportunities" },
  { key: "matches", href: "explore.html?sort=match", icon: "bi-bullseye", label: "My Matches" },
  { key: "saved", href: "saved.html", icon: "bi-bookmark", label: "Saved", badge: "saved" },
  { key: "applications", href: "applications.html", icon: "bi-kanban", label: "Applications", badge: "apps" },
  { key: "passport", href: "passport.html", icon: "bi-passport", label: "Opportunity Passport", isNew: true },
  { key: "messages", href: "messages.html", icon: "bi-chat-dots", label: "Messages" },
  { key: "notifications", href: "notifications.html", icon: "bi-bell", label: "Notifications", badge: "notifs" },
];
export function appShell(active, { rail = true } = {}) {
  const user = Store.user();
  const { readiness } = window.OPP_AI;
  const r = readiness(Store.passport());
  const shell = document.createElement("div");
  shell.className = "app-shell" + (rail ? "" : " no-rail");
  shell.innerHTML = `
    <aside class="app-sidebar" id="appSidebar">
      <a href="index.html" class="brand d-inline-flex mb-3" style="padding:0 10px 14px">${brandHtml(28)}</a>
      <nav aria-label="Dashboard">
        ${SIDE.map((s) => {
          const badge = s.badge === "saved" ? Store.saved().length : s.badge === "apps" ? Store.apps().length : s.badge === "notifs" ? Store.unreadCount() : 0;
          return `<a class="side-link ${active === s.key ? "active" : ""}" href="${s.href}"><i class="${s.icon}"></i>${s.label}${s.isNew ? `<span class="badge-new">New</span>` : s.badge ? `<span class="badge-count" data-badge="${s.badge}" ${badge ? "" : 'style="display:none"'}>${badge}</span>` : ""}</a>`;
        }).join("")}
      </nav>
      <div class="side-profile-card">
        <div class="d-flex align-items-center gap-2 mb-1"><i class="bi bi-stars" style="color:var(--blue)"></i><b style="font-size:13px;color:var(--ink)">Complete your profile</b></div>
        <p class="small mb-2" style="color:var(--muted)">Better matches start with a fuller Passport.</p>
        <div class="progress" style="height:7px" role="progressbar" aria-label="Profile completion" aria-valuenow="${r.completion}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${r.completion}%;background:var(--grad)"></div></div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="small fw-bold" style="color:var(--ink)">${r.completion}% complete</span>
          <a class="link-arrow" style="font-size:12px" href="passport.html">Complete now <i class="bi bi-arrow-right"></i></a>
        </div>
      </div>
      <div class="mt-3 px-2"><button class="btn-op btn-op-ghost btn-op-sm btn-op-block" data-logout><i class="bi bi-box-arrow-right"></i>Log out</button></div>
    </aside>
    <main class="app-main">
      <div class="app-topbar">
        <button class="icon-btn sidebar-toggle-mobile" id="sideToggle" aria-label="Open dashboard menu"><i class="bi bi-list"></i></button>
        <div class="greet"><h1 data-greet-title>Dashboard</h1><p data-greet-sub></p></div>
        <div class="tb-actions">
          <a class="icon-btn" href="notifications.html" aria-label="Notifications"><i class="bi bi-bell"></i>${Store.unreadCount() ? `<span class="ndot"></span>` : ""}</a>
          <a class="btn-op btn-op-outline btn-op-sm" href="profile.html"><i class="bi bi-person"></i><span class="d-none d-md-inline">View my profile</span></a>
        </div>
      </div>
      <div id="app-main"></div>
    </main>
    ${rail ? `<aside class="app-rail" id="app-rail"></aside>` : ""}
  `;
  document.body.prepend(shell);
  /* Adopt page-authored markup into the shell main region */
  [...document.body.children].forEach((el) => {
    if (el !== shell && el.tagName !== "SCRIPT" && el.tagName !== "STYLE") $("#app-main").appendChild(el);
  });
  $("#sideToggle")?.addEventListener("click", () => $("#appSidebar").classList.toggle("open"));
  return { main: $("#app-main"), rail: $("#app-rail"), shell };
}
export function setGreeting(title, sub) {
  const t = $("[data-greet-title]"), s = $("[data-greet-sub]");
  if (t) t.textContent = title;
  if (s) s.textContent = sub;
}
export function greetWord() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/* ---------- Rail widgets ---------- */
export function railPassportCard() {
  const { readiness } = window.OPP_AI;
  const r = readiness(Store.passport());
  return `<div class="panel">
    <div class="panel-head"><h3>Opportunity Passport</h3><a class="link-arrow" style="font-size:12px" href="passport.html">Edit <i class="bi bi-arrow-right"></i></a></div>
    <div class="d-flex align-items-center gap-3">
      ${ring(r.score, { size: 84, label: "Ready" })}
      <div><b style="color:var(--ink);font-size:14px">${r.score >= 80 ? "Great job!" : r.score >= 55 ? "Getting there" : "Let's build it"}</b><p class="small" style="color:var(--muted)">You're ${r.completion}% complete. ${r.missingActions[0] ? r.missingActions[0].text + " next." : "Nothing missing."}</p></div>
    </div>
    <a class="btn-op btn-op-primary btn-op-sm btn-op-block mt-3" href="passport.html"><i class="bi bi-sliders"></i>Improve my matches</a>
  </div>`;
}
export function railDeadlines(limit = 4) {
  const upcoming = ALL_OPPS.map((o) => ({ o, d: deadlineInfo(o) })).filter((x) => x.d.days >= 0).sort((a, b) => a.d.days - b.d.days).slice(0, limit);
  return `<div class="panel">
    <div class="panel-head"><h3>Upcoming deadlines</h3><a class="link-arrow" style="font-size:12px" href="explore.html?deadline=week">View all <i class="bi bi-arrow-right"></i></a></div>
    ${upcoming.map(({ o, d }) => {
      const cls = d.days <= 3 ? "pill-red" : d.days <= 7 ? "pill-amber" : "pill-blue";
      return `<div class="match-row" style="padding:10px 0">
        <span class="deadline-chip ${cls}" style="background:var(--bg-2)"><b>${d.days}</b><span>day${d.days === 1 ? "" : "s"}</span></span>
        <div class="mr-body"><a class="mr-title" href="opportunity.html?id=${o.id}">${esc(o.title)}</a><span class="mr-sub">${esc(o.org)}</span></div>
      </div>`;
    }).join("")}
  </div>`;
}

/* ---------- Modals: share & report ---------- */
export function shareModal(opp) {
  const url = location.origin + "/opportunity.html?id=" + opp.id;
  const text = encodeURIComponent(`${opp.title} — found on Oppora`);
  const id = "shareModal";
  let m = document.getElementById(id);
  if (!m) { m = document.createElement("div"); m.id = id; m.className = "modal fade modal-opp"; m.setAttribute("tabindex", "-1"); document.body.appendChild(m); }
  m.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title"><i class="bi bi-share me-2" style="color:var(--blue)"></i>Share this opportunity</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
    <div class="modal-body">
      <div class="input-group mb-3"><input class="input-opp" id="shareUrl" readonly value="${url}"><button class="btn-op btn-op-primary" id="copyShare" type="button"><i class="bi bi-clipboard"></i>Copy</button></div>
      <div class="d-flex gap-2 flex-wrap">
        <a class="btn-op btn-op-outline btn-op-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${text}%20${encodeURIComponent(url)}"><i class="bi bi-whatsapp"></i>WhatsApp</a>
        <a class="btn-op btn-op-outline btn-op-sm" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}"><i class="bi bi-twitter-x"></i>X</a>
        <a class="btn-op btn-op-outline btn-op-sm" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}"><i class="bi bi-linkedin"></i>LinkedIn</a>
      </div>
    </div></div></div>`;
  const bs = new window.bootstrap.Modal(m);
  bs.show();
  m.querySelector("#copyShare").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(url); toast("Link copied", "Share it with someone who needs this opportunity."); }
    catch { m.querySelector("#shareUrl").select(); document.execCommand("copy"); toast("Link copied"); }
  });
}
export function reportModal(opp) {
  const id = "reportModal";
  let m = document.getElementById(id);
  if (!m) { m = document.createElement("div"); m.id = id; m.className = "modal fade modal-opp"; m.setAttribute("tabindex", "-1"); document.body.appendChild(m); }
  m.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title"><i class="bi bi-flag me-2" style="color:var(--red)"></i>Report this opportunity</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
    <div class="modal-body">
      <p class="small mb-3" style="color:var(--muted)">Reports go to the Oppora trust team. In production this creates a review ticket and pauses the listing until re-verified.</p>
      <div class="field"><label for="repReason">Reason</label>
        <select class="select-opp" id="repReason"><option>Deadline has passed</option><option>Organisation cannot be verified</option><option>Asks for application fees</option><option>Suspicious or fraudulent request</option><option>Wrong category or details</option><option>Other</option></select></div>
      <div class="field"><label for="repNote">Details (optional)</label><textarea class="textarea-opp" id="repNote" rows="3" placeholder="Tell us what looks wrong…"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn-op btn-op-ghost btn-op-sm" data-bs-dismiss="modal">Cancel</button><button class="btn-op btn-op-primary btn-op-sm" id="repSend"><i class="bi bi-send"></i>Submit report</button></div>
  </div></div>`;
  const bs = new window.bootstrap.Modal(m);
  bs.show();
  m.querySelector("#repSend").addEventListener("click", () => {
    bs.hide();
    Store.notify({ type: "system", title: "Report submitted", body: `Thanks — “${opp.title}” is queued for trust review.`, link: "notifications.html" });
    toast("Report submitted", "Our trust team will review this listing.", "info");
  });
}

window.OPP_UI = { oppCard, catCard, emptyStateHtml, matchPill, deadlinePill, orgBadge, toast, ring, animateRings, $, $$, esc, fmtDate, timeAgo, initials, shareModal, reportModal, logoMark, brandHtml, renderNav, renderFooter, appShell, setGreeting, greetWord, railPassportCard, railDeadlines, initReveal, initBackToTop, verifiedTag };
