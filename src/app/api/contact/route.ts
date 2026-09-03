import { randomUUID } from "crypto";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string; topic?: string; message?: string };
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();
    if (name.length < 2) return Response.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (message.length < 12) {
      return Response.json({ ok: false, error: "Message looks too short — add a little more detail." }, { status: 400 });
    }
    await db.insert(contactMessages).values({
      id: randomUUID(),
      name: name.slice(0, 120),
      email,
      topic: String(body.topic || "general").slice(0, 80),
      message,
    });
    return Response.json({ ok: true, message: "Message received. Our team replies within 2 business days." });
  } catch {
    return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
