import { createFileRoute } from "@tanstack/react-router";
import { ScrollHomeExperience } from "../components/scroll-home-experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UnI Design Group | Architecture & Interior Design" },
      { name: "description", content: "UnI Design Group creates thoughtful architecture, interiors and visualisations shaped around people, purpose and detail." },
      { property: "og:title", content: "UnI Design Group | Architecture & Interior Design" },
      { property: "og:description", content: "Thoughtful architecture, interiors and visualisations shaped around people, purpose and detail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScrollHomeExperience,
});
