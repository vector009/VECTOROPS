import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VectorOps",
    short_name: "VectorOps",
    description: "AI automation agency operating system",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d10",
    theme_color: "#0b0d10",
    icons: [{ src: "/icons/icon.svg", sizes: "192x192", type: "image/svg+xml" }],
  };
}
