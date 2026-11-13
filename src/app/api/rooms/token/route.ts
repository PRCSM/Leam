import { NextResponse } from "next/server";
import { getRoom } from "@/lib/data";
import { liveKitConfigured } from "@/lib/livekit";
import { createLiveKitToken } from "@/lib/livekit-token";

/**
 * POST /api/rooms/token  { roomId: string, name: string }
 * Returns { token, url } for joining a LiveKit room as an audience member.
 *
 * PRODUCTION TODO before enabling: resolve the caller from your auth session,
 * verify they hold access to the room's Universe (membership / ticket), and
 * grant canPublish only to hosts or approved speakers.
 */
export async function POST(req: Request) {
  if (!liveKitConfigured()) {
    return NextResponse.json({ error: "Real-time rooms are not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET." }, { status: 503 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { roomId, name } = (body ?? {}) as { roomId?: unknown; name?: unknown };
  if (typeof roomId !== "string" || !getRoom(roomId)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  if (typeof name !== "string" || !name.trim() || name.length > 60) return NextResponse.json({ error: "A display name (1–60 chars) is required" }, { status: 422 });

  const identity = `guest-${crypto.randomUUID()}`;
  const token = createLiveKitToken({ identity, name: name.trim(), grant: { room: roomId, canPublish: false } });
  return NextResponse.json({ token, url: process.env.LIVEKIT_URL, identity });
}
