import { ImageResponse } from "next/og";

export const alt = "Leam — Create your Universe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "radial-gradient(60% 80% at 85% 10%, rgba(255,190,90,0.45), #050505 70%)",
          color: "#F7F7F5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, marginBottom: 20 }}>leam</div>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Create your Universe ✦</div>
        <div style={{ fontSize: 30, opacity: 0.7, marginTop: 28, maxWidth: 820 }}>Live rooms and a community chat for creators and their top 1% fans.</div>
      </div>
    ),
    size
  );
}
