import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/contact — validates a support/contact request.
 * No mail provider is wired up in this build, so the response says so
 * honestly (delivered: false). Plug in Resend/Postmark/etc. where marked.
 */
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof data.company === "string" && data.company) return NextResponse.json({ ok: true }, { status: 202 }); // honeypot

  const errors: Record<string, string> = {};
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const topic = typeof data.topic === "string" ? data.topic : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (name.length < 2 || name.length > 80) errors.name = "Please enter your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email.";
  if (!["creator", "support", "press", "other"].includes(topic)) errors.topic = "Choose a topic.";
  if (message.length < 20 || message.length > 4000) errors.message = "Tell us a little more (20–4000 characters).";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  // TODO(production): send via your email provider here.
  return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
}
