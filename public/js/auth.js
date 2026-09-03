/* ============================================================
   OPPORA — Mock authentication (prototype)
   Frontend validation + localStorage sessions. Production swaps
   these for POST /api/auth/signup | /login | /refresh.
   ============================================================ */

import { Store, seedDemo } from "./store.js";

export const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
export const validatePassword = (v) => String(v).length >= 8 && /[a-zA-Z]/.test(v) && /\d/.test(v);
export const validateName = (v) => String(v).trim().length >= 2;

export function signup({ name, email, pass }) {
  if (!validateName(name)) return { ok: false, field: "name", error: "Please enter your full name." };
  if (!validateEmail(email)) return { ok: false, field: "email", error: "Enter a valid email address." };
  if (!validatePassword(pass)) return { ok: false, field: "pass", error: "Password needs 8+ characters with letters and numbers." };
  const users = Store.users();
  if (users.some((u) => u.email === email.toLowerCase())) return { ok: false, field: "email", error: "An account with this email already exists. Try logging in." };
  users.push({ name: name.trim(), email: email.toLowerCase(), pass, createdAt: Date.now() });
  Store.write("users", users);
  Store.setUser({ name: name.trim(), email: email.toLowerCase(), joined: Date.now() });
  const p = Store.passport();
  Store.setPassport({ fullName: name.trim(), country: p.country || "" });
  Store.notify({ type: "system", title: "Welcome to Oppora 🎉", body: "Set up your Opportunity Passport to unlock personalized matching.", link: "onboarding.html" });
  Store.log("Created an Oppora account", "bi-person-plus");
  return { ok: true };
}

export function login(email, pass) {
  if (!validateEmail(email)) return { ok: false, field: "email", error: "Enter a valid email address." };
  if (email.toLowerCase() === "elijah@oppora.demo" && pass === "demo1234") { seedDemo(); return { ok: true, demo: true }; }
  const u = Store.users().find((x) => x.email === email.toLowerCase());
  if (!u) return { ok: false, field: "email", error: "No account found with this email." };
  if (u.pass !== pass) return { ok: false, field: "pass", error: "Incorrect password. Try again." };
  Store.setUser({ name: u.name, email: u.email, joined: u.createdAt });
  Store.log("Logged in", "bi-box-arrow-in-right");
  return { ok: true };
}

export function requireAuth() {
  if (!Store.user()) {
    const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.replace("login.html?next=" + next);
    return false;
  }
  return true;
}

export function requireGuest() {
  if (Store.user()) { location.replace("dashboard.html"); return false; }
  return true;
}
