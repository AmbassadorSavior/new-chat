import { randomUUID } from "crypto";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; source?: string };
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }
    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    if (existing.length === 0) {
      await db.insert(subscribers).values({
        id: randomUUID(),
        email,
        source: String(body.source || "footer").slice(0, 64),
      });
    }
    return Response.json({ ok: true, message: "You're on the list. Watch your inbox for weekly opportunity updates." });
  } catch {
    return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
