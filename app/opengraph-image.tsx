import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/data";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(139,116,240,0.35), transparent 45%), " +
            "radial-gradient(circle at 85% 30%, rgba(90,150,230,0.28), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a78bfa",
          }}
        >
          Toronto, ON
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -3,
            color: "#f5f5f7",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 40,
            color: "#a78bfa",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 26,
            color: "#9a9aa5",
          }}
        >
          Building AI-driven data platforms · CS @ University of Waterloo
        </div>
      </div>
    ),
    size,
  );
}
