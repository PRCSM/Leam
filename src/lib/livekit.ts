/** Server-side check: real-time rooms are only enabled when all LiveKit settings exist. */
export function liveKitConfigured() {
  return Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);
}
