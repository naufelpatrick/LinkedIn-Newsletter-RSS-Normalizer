import { ImageResponse } from "next/og";

export const alt = "LinkedIn Newsletter RSS Normalizer — Make newsletter RSS work everywhere";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "74px 80px", background: "#071019", color: "#f4f7f9", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 15, fontSize: 26, fontWeight: 700 }}><span style={{ width: 25, height: 25, border: "7px solid #69e4bb", borderRightColor: "#23483f", borderRadius: "50%" }} /> RSS Normalizer</div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 86, lineHeight: .95, letterSpacing: "-5px", fontWeight: 800 }}>Make newsletter RSS</div><div style={{ color: "#69e4bb", fontSize: 86, lineHeight: 1, letterSpacing: "-5px", fontWeight: 800 }}>work everywhere.</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#91a6b4", fontSize: 22 }}><span>Open source · No scraping · No database</span><span>MIT licensed</span></div>
    </div>, size
  );
}
