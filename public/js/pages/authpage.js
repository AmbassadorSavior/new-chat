import "../app.js";
import { $, toast, brandHtml } from "../ui.js";
import { login, signup, validateEmail } from "../auth.js";
import { Store, seedDemo } from "../store.js";

const mode = new URLSearchParams(location.search).get("mode") || document.body.dataset.auth || "login";
const next = new URLSearchParams(location.search).get("next") || "dashboard.html";

if (Store.user() && mode !== "forgot") location.replace("dashboard.html");

$("#brandSlot").innerHTML = `<a href="index.html" class="brand mb-4">${brandHtml(30)}</a>`;

const setErr = (field, msg) => {
  const f = $(`#field-${field}`);
  if (!f) return;
  f.classList.toggle("invalid", !!msg);
  const e = f.querySelector(".field-error");
  if (e) e.textContent = msg || "";
};

if (mode === "forgot") {
  $("#authForm").innerHTML = `
    <h1 style="font-size:26px;font-weight:800;letter-spacing:-.02em">Reset your password</h1>
    <p class="mt-2 mb-4" style="color:var(--muted)">Enter the email on your account and we'll send a reset link. (Prototype: no email is actually sent.)</p>
    <div class="field" id="field-email"><label for="email">Email address</label><input class="input-opp" id="email" type="email" autocomplete="email" placeholder="you@example.com"><div class="field-error"></div></div>
    <button class="btn-op btn-op-primary btn-op-block btn-op-lg" id="submitBtn" type="submit"><i class="bi bi-envelope-paper"></i>Send reset link</button>
    <p class="text-center mt-4 small" style="color:var(--muted)">Remembered it? <a href="login.html">Back to login</a></p>`;
} else if (mode === "login") {
  $("#authForm").innerHTML = `
    <h1 style="font-size:26px;font-weight:800;letter-spacing:-.02em">Welcome Back!</h1>
    <p class="mt-2 mb-4" style="color:var(--muted)">Log in to your account</p>
    <div class="field" id="field-email"><label for="email">Email address</label><input class="input-opp" id="email" type="email" autocomplete="email" placeholder="you@example.com"><div class="field-error"></div></div>
    <div class="field" id="field-pass"><label for="pass">Password</label><input class="input-opp" id="pass" type="password" autocomplete="current-password" placeholder="••••••••"><div class="field-error"></div></div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="form-check"><input class="form-check-input" type="checkbox" id="remember" checked><label class="form-check-label small" for="remember">Keep me logged in</label></div>
      <a class="small fw-bold" href="login.html?mode=forgot">Forgot password?</a>
    </div>
    <button class="btn-op btn-op-primary btn-op-block btn-op-lg" id="submitBtn" type="submit"><i class="bi bi-box-arrow-in-right"></i>Log in</button>
    <div class="divider-or">OR</div>
    <button class="btn-op btn-op-outline btn-op-block" id="demoBtn" type="button"><i class="bi bi-lightning-charge"></i>Continue with the demo account</button>
    <p class="text-center mt-4 small" style="color:var(--muted)">New to Oppora? <a href="signup.html">Create a free account</a></p>`;
} else {
  $("#authForm").innerHTML = `
    <h1 style="font-size:26px;font-weight:800;letter-spacing:-.02em">Create your free account</h1>
    <p class="mt-2 mb-4" style="color:var(--muted)">Two minutes now, thousands of matched opportunities later.</p>
    <div class="signup-fields-row"><div class="field" id="field-name"><label for="name">Full name</label><input class="input-opp" id="name" autocomplete="name" placeholder="Amara Diallo"><div class="field-error"></div></div><div class="field"><label for="username">Username</label><input class="input-opp" id="username" autocomplete="username" placeholder="Choose a username"><div class="field-error"></div></div></div>
    <div class="field" id="field-email"><label for="email">Email address</label><input class="input-opp" id="email" type="email" autocomplete="email" placeholder="you@example.com"><div class="field-error"></div></div>
    <div class="field" id="field-pass"><label for="pass">Password</label><input class="input-opp" id="pass" type="password" autocomplete="new-password" placeholder="8+ characters, letters & numbers"><div class="field-error"></div></div>
    <div class="form-check mb-3" id="field-terms"><div class="field-error"></div><input class="form-check-input" type="checkbox" id="terms"><label class="form-check-label small" for="terms">I agree to the <a href="about.html#terms">Terms</a> and <a href="about.html#privacy">Privacy Policy</a></label></div>
    <button class="btn-op btn-op-primary btn-op-block btn-op-lg" id="submitBtn" type="submit">Create Free Account</button>
    <p class="text-center mt-4 small" style="color:var(--muted)">Already have an account? <a href="login.html">Log in</a></p>`;
  $("#demoBtn")?.remove();
}

$("#authForm").addEventListener("submit", (e) => {
  e.preventDefault();
  ["name", "email", "pass", "terms"].forEach((f) => setErr(f, ""));
  const btn = $("#submitBtn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border" role="status"></span> One moment…`;

  setTimeout(() => {
    if (mode === "forgot") {
      const email = $("#email").value;
      if (!validateEmail(email)) { setErr("email", "Enter a valid email address."); reset(); return; }
      $("#authForm").insertAdjacentHTML("afterbegin", `<div class="demo-note mb-3 w-100"><i class="bi bi-check-circle"></i>If an account exists for ${email}, a reset link is on its way. (Prototype — check the demo inbox.)</div>`);
      reset(); return;
    }
    if (mode === "login") {
      const r = login($("#email").value, $("#pass").value);
      if (!r.ok) { setErr(r.field, r.error); reset(); return; }
      toast(r.demo ? "Demo account loaded 🎉" : `Welcome back 👋`, r.demo ? "Sample Passport, saves and applications restored." : "Picking up where you left off.");
      setTimeout(() => location.assign(next), 500);
      return;
    }
    if (!$("#terms").checked) { setErr("terms", "Please accept the terms to continue."); reset(); return; }
    const r = signup({ name: $("#name").value, email: $("#email").value, pass: $("#pass").value });
    if (!r.ok) { setErr(r.field, r.error); reset(); return; }
    location.assign("dashboard.html");
  }, 450);

  function reset() { btn.disabled = false; btn.innerHTML = mode === "login" ? '<i class="bi bi-box-arrow-in-right"></i>Log in' : mode === "signup" ? '<i class="bi bi-rocket-takeoff"></i>Create account' : '<i class="bi bi-envelope-paper"></i>Send reset link'; }
});

$("#demoBtn")?.addEventListener("click", () => {
  seedDemo();
  toast("Demo account loaded 🎉", "Passport, saves, applications and messages restored.");
  setTimeout(() => location.assign("dashboard.html"), 450);
});
