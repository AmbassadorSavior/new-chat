import "../app.js";
import { $, toast } from "../ui.js";

/* Contact form -> real backend endpoint */
$("#contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#contactSend");
  const name = $("#cName").value.trim();
  const email = $("#cEmail").value.trim();
  const msg = $("#cMsg").value.trim();
  const err = $("#contactErr");
  const setErr = (t) => { err.textContent = t || ""; err.style.display = t ? "block" : "none"; };
  setErr("");
  if (name.length < 2) { setErr("Please tell us your name."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr("Enter a valid email address."); return; }
  if (msg.length < 12) { setErr("Message looks too short — add a little more detail."); return; }
  btn.disabled = true; btn.innerHTML = `<span class="spinner-border"></span> Sending…`;
  try {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, topic: $("#cTopic").value, message: msg }) });
    const data = await res.json();
    if (data.ok) { toast("Message sent 📨", data.message); e.target.reset(); }
    else { err.textContent = data.error || "Something went wrong."; }
  } catch { err.textContent = "Network error — please try again."; }
  finally { btn.disabled = false; btn.innerHTML = '<i class="bi bi-send"></i>Send message'; }
});

/* Smooth anchor scroll for hash links */
if (location.hash) {
  const el = document.querySelector(location.hash);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
}
