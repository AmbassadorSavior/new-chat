/* ============================================================
   OPPORA — Client state store (localStorage persistence)
   Prototype auth + user state. Swap `MockBackend` for real
   endpoints (POST /api/auth/..., /api/passport) in production.
   ============================================================ */

const NS = "oppora.v1.";
const read = (k, d) => { try { const v = localStorage.getItem(NS + k); return v ? JSON.parse(v) : d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(NS + k, JSON.stringify(v));
const emit = () => window.dispatchEvent(new CustomEvent("opp:change"));

export const Store = {
  read, write,
  clearAll() { Object.keys(localStorage).filter((k) => k.startsWith(NS)).forEach((k) => localStorage.removeItem(k)); },

  /* ---------- session ---------- */
  user() { return read("user", null); },
  setUser(u) { write("user", u); emit(); },
  users() { return read("users", []); },
  logout() { localStorage.removeItem(NS + "user"); emit(); },

  /* ---------- passport ---------- */
  emptyPassport() {
    return {
      fullName: "", headline: "", country: "", city: "",
      status: "",            // student | professional | entrepreneur | job-seeker
      education: { level: "", field: "", institution: "", graduation: "" },
      skills: [], experience: "", certifications: [],
      interests: [], countriesOfInterest: [],
      preferredTypes: [], workModes: [],
      careerGoal: "", entrepreneurshipGoal: "", fundingNeed: "",
      updatedAt: null,
    };
  },
  passport() {
    const u = this.user();
    return read("passport." + (u ? u.email : "guest"), this.emptyPassport());
  },
  setPassport(patch) {
    const u = this.user();
    const cur = this.passport();
    const next = { ...cur, ...patch, updatedAt: Date.now() };
    write("passport." + (u ? u.email : "guest"), next);
    emit();
    return next;
  },

  /* ---------- saved ---------- */
  saved() { return read("saved", []); },
  isSaved(id) { return this.saved().includes(id); },
  toggleSave(id) {
    const s = this.saved();
    const on = !s.includes(id);
    write("saved", on ? [id, ...s] : s.filter((x) => x !== id));
    emit();
    return on;
  },

  /* ---------- applications ---------- */
  apps() { return read("apps", []); },
  appFor(id) { return this.apps().find((a) => a.oppId === id) || null; },
  addApp(oppId, status = "applied", notes = "") {
    const list = this.apps();
    const existing = list.find((a) => a.oppId === oppId);
    if (existing) { existing.status = status; existing.updatedAt = Date.now(); if (notes) existing.notes = notes; write("apps", list); emit(); return existing; }
    const rec = { oppId, status, notes, createdAt: Date.now(), updatedAt: Date.now(), appliedAt: status === "applied" || status === "interview" || status === "accepted" || status === "rejected" ? Date.now() : null };
    write("apps", [rec, ...list]);
    emit();
    return rec;
  },
  setAppStatus(oppId, status) {
    const list = this.apps();
    const rec = list.find((a) => a.oppId === oppId);
    if (!rec) return this.addApp(oppId, status);
    rec.status = status; rec.updatedAt = Date.now();
    if (!rec.appliedAt && ["applied", "interview", "accepted", "rejected"].includes(status)) rec.appliedAt = Date.now();
    write("apps", list); emit();
    return rec;
  },
  setAppNotes(oppId, notes) {
    const list = this.apps();
    const rec = list.find((a) => a.oppId === oppId);
    if (rec) { rec.notes = notes; rec.updatedAt = Date.now(); write("apps", list); emit(); }
  },
  removeApp(oppId) { write("apps", this.apps().filter((a) => a.oppId !== oppId)); emit(); },

  /* ---------- notifications ---------- */
  notifs() { return read("notifs", []); },
  notify({ type = "info", title, body = "", link = "" }) {
    const list = this.notifs();
    list.unshift({ id: "n" + Date.now() + Math.floor(Math.random() * 999), type, title, body, link, ts: Date.now(), read: false });
    write("notifs", list.slice(0, 60)); emit();
  },
  markNotif(id) { const l = this.notifs().map((n) => (n.id === id ? { ...n, read: true } : n)); write("notifs", l); emit(); },
  markAllNotifs() { write("notifs", this.notifs().map((n) => ({ ...n, read: true }))); emit(); },
  unreadCount() { return this.notifs().filter((n) => !n.read).length; },

  /* ---------- activity ---------- */
  activity() { return read("activity", []); },
  log(text, icon = "bi-lightning-charge") {
    const l = this.activity();
    l.unshift({ text, icon, ts: Date.now() });
    write("activity", l.slice(0, 30));
  },

  /* ---------- messages ---------- */
  msgs() { return read("msgs", null); },
  setMsgs(m) { write("msgs", m); emit(); },

  /* ---------- prefs ---------- */
  prefs() { return read("prefs", { emailMatches: true, emailDeadlines: true, emailNewsletter: false, push: true }); },
  setPrefs(p) { write("prefs", { ...this.prefs(), ...p }); emit(); },

  seenBanner() { return read("seenDemoBanner", false); },
  setSeenBanner() { write("seenDemoBanner", true); },
};

/* ---------- Demo seed (rich state for the demo account) ---------- */
export function seedDemo() {
  const email = "elijah@oppora.demo";
  const users = Store.users().filter((u) => u.email !== email);
  users.push({ name: "Elijah Okafor", email, pass: "demo1234", createdAt: Date.now() - 40 * 86400000 });
  Store.write("users", users);
  Store.setUser({ name: "Elijah Okafor", email, joined: Date.now() - 40 * 86400000 });
  Store.write("passport." + email, {
    ...Store.emptyPassport(),
    fullName: "Elijah Okafor",
    headline: "Final-year Computer Science student · aspiring data engineer",
    country: "Nigeria", city: "Lagos", status: "student",
    education: { level: "Undergraduate", field: "Computer Science", institution: "University of Lagos", graduation: "2026" },
    skills: ["Python", "SQL", "JavaScript", "Data Analysis", "Git"],
    experience: "1 internship (6 months, fintech data team)",
    certifications: ["AWS Cloud Practitioner"],
    interests: ["Data Science", "Fintech", "Climate & Environment"],
    countriesOfInterest: ["Nigeria", "Kenya", "Rwanda", "United Kingdom"],
    preferredTypes: ["scholarship", "internship", "remote", "job"],
    workModes: ["remote", "hybrid"],
    careerGoal: "Become a data engineer building financial infrastructure for African markets.",
    entrepreneurshipGoal: "",
    fundingNeed: "Master's tuition support",
    updatedAt: Date.now() - 3 * 86400000,
  });
  Store.write("saved", ["sch-02", "job-01", "gr-01", "rem-01"]);
  Store.write("apps", [
    { oppId: "sch-01", status: "applied", notes: "Submitted with UCT admission letter. Awaiting review.", createdAt: Date.now() - 12 * 86400000, updatedAt: Date.now() - 12 * 86400040, appliedAt: Date.now() - 12 * 86400000 },
    { oppId: "int-01", status: "interview", notes: "Technical interview scheduled — revise Python & SQL.", createdAt: Date.now() - 9 * 86400000, updatedAt: Date.now() - 2 * 86400000, appliedAt: Date.now() - 9 * 86400000 },
    { oppId: "job-02", status: "preparing", notes: "Drafting cover letter; request reference from internship manager.", createdAt: Date.now() - 4 * 86400000, updatedAt: Date.now() - 1 * 86400000, appliedAt: null },
    { oppId: "com-02", status: "interested", notes: "Looking for a teammate from the ALX community.", createdAt: Date.now() - 2 * 86400000, updatedAt: Date.now() - 2 * 86400000, appliedAt: null },
  ]);
  Store.write("notifs", [
    { id: "n1", type: "match", title: "6 new matches for your Passport", body: "Including a fully funded DAAD master's in Kigali closing in 3 weeks.", link: "explore.html?sort=match", ts: Date.now() - 3600e3, read: false },
    { id: "n2", type: "deadline", title: "Interview reminder — Google Africa", body: "Your technical interview for the Developer Internship is in 3 days.", link: "applications.html", ts: Date.now() - 7200e3, read: false },
    { id: "n3", type: "deadline", title: "Deadline in 3 days", body: "Women in Tech Africa Scholarship closes soon — you match at 88%.", link: "opportunity.html?id=sch-06", ts: Date.now() - 26 * 3600e3, read: false },
    { id: "n4", type: "system", title: "Welcome to Oppora", body: "Complete your Opportunity Passport to unlock personalized matching.", link: "passport.html", ts: Date.now() - 39 * 86400000, read: true },
  ]);
  Store.write("activity", [
    { text: "Saved “Remote Full-Stack Developer (EMEA)”", icon: "bi-bookmark", ts: Date.now() - 26 * 3600e3 },
    { text: "Moved Google Africa Internship to Interview", icon: "bi-arrow-repeat", ts: Date.now() - 2 * 86400000 },
    { text: "Applied to Mastercard Foundation Scholars Program", icon: "bi-send", ts: Date.now() - 12 * 86400000 },
    { text: "Updated Opportunity Passport — added AWS Cloud Practitioner", icon: "bi-passport", ts: Date.now() - 3 * 86400000 },
  ]);
  Store.write("msgs", [
    { id: "m1", from: "assist", text: "Hi Elijah 👋 I'm Oppora Assist. Ask me anything about eligibility, documents or deadlines — or say “recommend something” and I'll scan today's matches.", ts: Date.now() - 26 * 3600e3 },
    { id: "m2", from: "assist", text: "Heads-up: the Women in Tech Africa Scholarship closes in 3 days and your Passport matches it at 88%. Want a document checklist for it?", ts: Date.now() - 5 * 3600e3 },
  ]);
  emit();
}
