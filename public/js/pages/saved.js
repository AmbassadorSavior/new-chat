import "../app.js";
import { $, oppCard, emptyStateHtml, setGreeting, greetWord, railPassportCard, railDeadlines } from "../ui.js";
import { Store } from "../store.js";
import { getOpp } from "../data.js";
import { match } from "../ai.js";

const user = Store.user();
setGreeting("Saved opportunities", "Your shortlist — everything you bookmarked across Oppora.");

async function render() {
  const ids = Store.saved();
  const host = $("#savedGrid");
  if (!ids.length) {
    host.innerHTML = `<div class="col-12">${emptyStateHtml({ icon: "bi-bookmark", title: "No saved opportunities", body: "Tap the bookmark on any opportunity card and it will wait for you here — synced to this browser.", action: '<a class="btn-op btn-op-primary" href="explore.html">Explore opportunities</a>' })}</div>`;
    return;
  }
  const opps = ids.map(getOpp).filter(Boolean);
  const scores = Object.fromEntries(await Promise.all(opps.map(async (o) => [o.id, (await match(o)).score])));
  host.innerHTML = opps.map((o) => oppCard(o, { matchScore: scores[o.id] })).join("");
  window.dispatchEvent(new CustomEvent("opp:render"));
}
render();
window.addEventListener("opp:change", render);

$("#app-rail").innerHTML = railPassportCard() + railDeadlines(3);
window.dispatchEvent(new CustomEvent("opp:render"));
