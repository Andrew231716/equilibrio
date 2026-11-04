import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F4EF",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#E8F0EA" />
          <path
            d="M32 50 C32 50 14 38 14 24 C14 16.5 19.5 12 26.5 12 C29.5 12 31.5 13.8 32 14.2 C32.5 13.8 34.5 12 37.5 12 C44.5 12 50 16.5 50 24 C50 38 32 50 32 50 Z"
            fill="#2F5D45"
          />
          <path d="M32 18 L32 46" stroke="#7FA88A" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M22 29 C27 26.5 29.5 24 32 21.5 C34.5 24 37 26.5 42 29"
            stroke="#A8D0B4"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="32" cy="12" r="2.5" fill="#4F7A5C" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
