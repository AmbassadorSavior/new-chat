import "../app.js";
import { $, esc, setGreeting, toast } from "../ui.js";
import { Store } from "../store.js";
import { assistReply } from "../ai.js";

setGreeting("Messages", "Oppora Assist — your eligibility, deadline and document co-pilot.");

if (!Store.msgs()) Store.setMsgs([{ id: "m1", from: "assist", text: "Hello! I'm Oppora Assist. Ask me to recommend matches, explain a deadline, or build a document checklist.", ts: Date.now() }]);

const QUICK = ["Recommend something for me", "What closes this week?", "Build me a document checklist", "How do I check eligibility?"];

function thread() { return Store.msgs(); }
function render() {
  $("#threadBody").innerHTML = thread().map((m) => `<div class="msg ${m.from === "assist" ? "in" : "out"}">${esc(m.text)}<span class="msg-t">${new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>`).join("");
  $("#threadBody").scrollTop = $("#threadBody").scrollHeight;
}
render();

$("#quickRow").innerHTML = QUICK.map((q) => `<button class="tag-chip" data-q="${q}">${q}</button>`).join("");
$("#quickRow").querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => send(b.dataset.q)));

async function send(text) {
  const list = thread();
  list.push({ id: "m" + Date.now(), from: "me", text, ts: Date.now() });
  Store.setMsgs(list);
  render();
  $("#sendBtn").disabled = true;
  const typing = { id: "typing", from: "assist", text: "…", ts: Date.now() };
  Store.setMsgs([...thread(), typing]);
  render();
  const reply = await assistReply(text);
  Store.setMsgs([...thread().filter((m) => m.id !== "typing"), { id: "m" + Date.now() + 1, from: "assist", text: reply, ts: Date.now() }]);
  $("#sendBtn").disabled = false;
  render();
}

$("#msgForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#msgInput").value.trim();
  if (!v) { toast("Type a message first", undefined, "info"); return; }
  $("#msgInput").value = "";
  send(v);
});

$("#app-rail").innerHTML = `
  <div class="ai-panel">
    <div class="ai-head"><span class="ai-logo"><i class="bi bi-stars"></i></span><b style="color:var(--ink);font-size:14px">What Assist can do</b></div>
    <div class="reason-row ok"><i class="bi bi-bullseye"></i>Recommend matches from your Passport</div>
    <div class="reason-row ok"><i class="bi bi-clock-history"></i>Summarise deadlines closing soon</div>
    <div class="reason-row ok"><i class="bi bi-files"></i>Build document checklists</div>
    <div class="reason-row ok"><i class="bi bi-patch-check"></i>Explain the eligibility checker</div>
    <p class="small mt-2 mb-0" style="color:var(--muted)">Rule-based in the prototype; production routes to the Oppora AI assistant API with your Passport as context.</p>
  </div>`;
window.dispatchEvent(new CustomEvent("opp:render"));
