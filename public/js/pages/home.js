import "../app.js";
import { $, $$, oppCard, catCard, toast } from "../ui.js";
import { ALL_OPPS } from "../data.js";
import { match } from "../ai.js";
import { Store } from "../store.js";

/* Hero search */
const form = $("#heroSearch");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#heroQ").value.trim();
  const cat = $("#heroCat").value;
  location.assign(`explore.html?${new URLSearchParams({ q, cat }).toString()}`);
});
$$("[data-popular]").forEach((b) => b.addEventListener("click", () => { $("#heroQ").value = b.dataset.popular; form.requestSubmit(); }));

/* Category cards with platform-scale counts */
const PLATFORM_COUNTS = { scholarship: 6870, internship: 8240, remote: 4320, grant: 3145, competition: 1860, volunteer: 3240 };
const categoryGrid = $("#catGrid");
if (categoryGrid) {
  categoryGrid.innerHTML = ["scholarship", "internship", "remote", "grant", "competition", "volunteer"].map((k) => catCard(k, PLATFORM_COUNTS[k])).join("");
}

/* Featured opportunities */
(async () => {
  const featuredGrid = $("#featuredGrid");
  if (!featuredGrid) return;
  try {
    const featured = ALL_OPPS.filter((o) => o.featured).slice(0, 6);
    const scores = Store.user() ? Object.fromEntries(await Promise.all(featured.map(async (o) => [o.id, (await match(o)).score]))) : {};
    featuredGrid.innerHTML = featured.map((o) => oppCard(o, { matchScore: scores[o.id] ?? null })).join("");
    window.dispatchEvent(new CustomEvent("opp:render"));
  } catch (error) {
    console.error("Unable to render featured opportunities", error);
    featuredGrid.innerHTML = '<div class="empty-state"><div class="es-icon"><i class="bi bi-cloud-slash"></i></div><h3>Featured opportunities are unavailable</h3><p>Please refresh the page to try again.</p></div>';
  }
})();

/* Mission video: respect reduced motion */
const vid = $("#missionVideo");
if (vid) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { vid.removeAttribute("autoplay"); vid.pause?.(); }
  const toggle = $("#videoToggle");
  toggle?.addEventListener("click", () => {
    if (vid.paused) { vid.play(); toggle.innerHTML = '<i class="bi bi-pause-fill"></i> Pause'; }
    else { vid.pause(); toggle.innerHTML = '<i class="bi bi-play-fill"></i> Play'; }
  });
}

/* Passport teaser live value */
const teaser = $("#passportTeaser");
if (teaser && Store.user()) {
  const p = Store.passport();
  teaser.textContent = `${p.fullName ? p.fullName.split(" ")[0] + "'s" : "Your"} Passport currently lists ${(p.skills || []).length} skills and ${(p.preferredTypes || []).length} followed opportunity types.`;
}

$("#ctaExplore")?.addEventListener("click", () => toast("Loading your matches…", "Sorting today's opportunities by fit.", "info"));
