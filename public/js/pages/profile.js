import "../app.js";
import { $, $$, toast, setGreeting, esc } from "../ui.js";
import { Store } from "../store.js";
import { validateEmail, validatePassword } from "../auth.js";

setGreeting("Profile & settings", "Account details, notification preferences and data controls.");

const user = Store.user();
const prefs = Store.prefs();

$("#acctForm").innerHTML = `
  <div class="row g-3">
    <div class="col-md-6 field mb-0"><label for="pName">Full name</label><input class="input-opp" id="pName" value="${esc(user.name)}"></div>
    <div class="col-md-6 field mb-0"><label for="pEmail">Email</label><input class="input-opp" id="pEmail" value="${esc(user.email)}" ${user.email === "elijah@oppora.demo" ? "" : ""}></div>
    <div class="col-md-6 field mb-0"><label for="pHead">Headline</label><input class="input-opp" id="pHead" value="${esc(Store.passport().headline || "")}" placeholder="One line about you"></div>
    <div class="col-md-6 field mb-0"><label for="pJoined">Member since</label><input class="input-opp" id="pJoined" value="${new Date(user.joined || Date.now()).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}" disabled></div>
  </div>
  <button class="btn-op btn-op-primary btn-op-sm mt-3" id="saveAcct"><i class="bi bi-check2"></i>Save changes</button>`;

$("#saveAcct").addEventListener("click", () => {
  const name = $("#pName").value.trim();
  if (name.length < 2) { toast("Name too short", undefined, "error"); return; }
  const email = $("#pEmail").value.trim().toLowerCase();
  if (!validateEmail(email)) { toast("Invalid email", undefined, "error"); return; }
  Store.setUser({ ...user, name, email });
  Store.setPassport({ headline: $("#pHead").value.trim(), fullName: name });
  toast("Profile updated", "Changes saved to this browser.", "success");
});

$("#passForm").innerHTML = `
  <div class="row g-3">
    <div class="col-md-4 field mb-0"><label for="curPass">Current password</label><input class="input-opp" id="curPass" type="password"></div>
    <div class="col-md-4 field mb-0"><label for="newPass">New password</label><input class="input-opp" id="newPass" type="password"></div>
    <div class="col-md-4 field mb-0"><label for="confPass">Confirm new</label><input class="input-opp" id="confPass" type="password"></div>
  </div>
  <button class="btn-op btn-op-outline btn-op-sm mt-3" id="savePass"><i class="bi bi-key"></i>Update password</button>
  <p class="small mt-2 mb-0" style="color:var(--faint)">Prototype: credentials live in localStorage only. Production uses hashed credentials via the auth API.</p>`;
$("#savePass").addEventListener("click", () => {
  const users = Store.users();
  const rec = users.find((u) => u.email === user.email);
  if (rec && rec.pass !== $("#curPass").value) { toast("Current password incorrect", undefined, "error"); return; }
  if (!validatePassword($("#newPass").value)) { toast("Weak password", "8+ characters with letters and numbers.", "error"); return; }
  if ($("#newPass").value !== $("#confPass").value) { toast("Passwords don't match", undefined, "error"); return; }
  if (rec) { rec.pass = $("#newPass").value; Store.write("users", users); }
  toast("Password updated", undefined, "success");
  ["curPass", "newPass", "confPass"].forEach((i) => { $("#" + i).value = ""; });
});

$("#prefForm").innerHTML = [["emailMatches", "Email me new matches"], ["emailDeadlines", "Deadline reminders"], ["push", "In-app alerts"], ["emailNewsletter", "Weekly digest"]].map(([k, l]) => `
  <div class="form-check form-switch switch-lg d-flex justify-content-between align-items-center py-2">
    <label class="form-check-label fw-semibold" style="font-size:14px;color:var(--ink-2)" for="s-${k}">${l}</label>
    <input class="form-check-input ms-0" type="checkbox" role="switch" id="s-${k}" data-pref="${k}" ${prefs[k] ? "checked" : ""}>
  </div>`).join("");
$$("[data-pref]").forEach((cb) => cb.addEventListener("change", () => { Store.setPrefs({ [cb.dataset.pref]: cb.checked }); toast("Preference saved", undefined, "info"); }));

$("#dangerZone").innerHTML = `
  <div class="d-flex flex-wrap gap-2">
    <button class="btn-op btn-op-outline btn-op-sm" id="clearData"><i class="bi bi-arrow-counterclockwise"></i>Reset demo data</button>
    <button class="btn-op btn-op-sm" style="background:var(--red-soft);color:var(--red)" id="delAcct"><i class="bi bi-trash"></i>Delete account & data</button>
  </div>
  <p class="small mt-2 mb-0" style="color:var(--muted)">Clears Passport, saves, applications and notifications from this browser.</p>`;
$("#clearData").addEventListener("click", () => { Store.clearAll(); location.assign("index.html"); });
$("#delAcct").addEventListener("click", () => { Store.clearAll(); location.assign("index.html"); });

$("#app-rail").innerHTML = `
  <div class="panel">
    <div class="panel-head"><h3>Session</h3></div>
    <div class="rail-user" style="border:0;padding:0">
      <span class="nav-avatar">${window.OPP_UI.initials(user.name)}</span>
      <div><b style="color:var(--ink);font-size:14px">${esc(user.name)}</b><br><span class="small" style="color:var(--muted)">${esc(user.email)}</span></div>
    </div>
    <button class="btn-op btn-op-ghost btn-op-sm btn-op-block mt-3" data-logout><i class="bi bi-box-arrow-right"></i>Log out</button>
  </div>`;
window.dispatchEvent(new CustomEvent("opp:render"));
