import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EQUILIBRIO",
    short_name: "Equilibrio",
    description: "Riconosci e gestisci lo stress con consapevolezza.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EF",
    theme_color: "#2F5D45",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
