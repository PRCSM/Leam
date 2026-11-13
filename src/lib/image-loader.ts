"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Image loader for Unsplash.
 * - unsplash.com/photos/<id>/download → redirects to the images.unsplash.com CDN,
 *   forwarding the sizing params below.
 * - Local /public assets are returned untouched.
 */
export default function unsplashLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  url.searchParams.set("fm", "jpg");
  return url.toString();
}
