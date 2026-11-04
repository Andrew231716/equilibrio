import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#E8F0EA" />
          <path
            d="M32 48 C32 48 18 38 18 26 C18 20 22 16 28 16 C30.5 16 32 17.5 32 17.5 C32 17.5 33.5 16 36 16 C42 16 46 20 46 26 C46 38 32 48 32 48 Z"
            fill="#2F5D45"
          />
          <path d="M32 20 L32 44" stroke="#7FA88A" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M24 30 C28 28 30 26 32 24 C34 26 36 28 40 30"
            stroke="#A8D0B4"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
