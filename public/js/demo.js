/*
 * Oppora presentation-mode data layer.
 * The existing data.js, store.js and ai.js modules provide the opportunity,
 * user, category and match-score demo data. These helpers cover submissions
 * that normally reach the backend, so the presentation works offline too.
 */

import { ALL_OPPS, CATS } from "./data.js";
import { Store } from "./store.js";

const DEMO_NS = "oppora.demo.";

const readList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_NS + key) || "[]");
  } catch {
    return [];
  }
};

const writeList = (key, value) => localStorage.setItem(DEMO_NS + key, JSON.stringify(value));

export const DEMO_MODE = true;
export const DEMO_USER = { name: "Demo opportunity seeker", email: "demo@oppora.local" };
export const DEMO_OPPORTUNITIES = ALL_OPPS;
export const DEMO_CATEGORIES = CATS;

export function demoUsers() {
  return Store.users();
}

export async function demoMatchScores(passport) {
  const { match } = await import("./ai.js");
  return Object.fromEntries(await Promise.all(ALL_OPPS.map(async (opportunity) => [opportunity.id, (await match(opportunity, passport)).score])));
}

export function saveDemoSubscription(email) {
  const subscriptions = readList("subscriptions");
  if (!subscriptions.includes(email)) writeList("subscriptions", [...subscriptions, email]);
  return { ok: true, message: "You're on the demo list. Weekly opportunity updates are simulated locally." };
}

export function saveDemoContact(message) {
  const messages = readList("contact-messages");
  writeList("contact-messages", [...messages, { ...message, createdAt: Date.now() }]);
  return { ok: true, message: "Message saved in the demo inbox. In production, it will be sent to the Oppora team." };
}
