import "server-only";
import { createHmac } from "node:crypto";

type Grant = { room: string; canPublish: boolean; canSubscribe?: boolean; canPublishData?: boolean };

const b64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");

/**
 * Mints a LiveKit access token (HS256 JWT) without extra dependencies.
 * Spec: https://docs.livekit.io/home/get-started/authentication/
 * Runs on the server only — the API secret never reaches the browser.
 */
export function createLiveKitToken({ identity, name, grant, ttlSeconds = 60 * 60 }: { identity: string; name: string; grant: Grant; ttlSeconds?: number }) {
  const key = process.env.LIVEKIT_API_KEY;
  const secret = process.env.LIVEKIT_API_SECRET;
  if (!key || !secret) throw new Error("LiveKit is not configured");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: key,
    sub: identity,
    name,
    nbf: now - 10,
    exp: now + ttlSeconds,
    video: { roomJoin: true, room: grant.room, canPublish: grant.canPublish, canSubscribe: grant.canSubscribe ?? true, canPublishData: grant.canPublishData ?? true },
  };
  const body = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}
