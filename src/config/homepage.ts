/**
 * UnI homepage content and media map.
 * Keep replacement images in src/assets and update these imports/paths as needed.
 */
export const studioPalette = {
  cream: "#F4EDE1",
  ivory: "#FAF6EE",
  walnut: "#5A3825",
  brass: "#C79A3E",
  charcoal: "#1B1A18",
  marble: "#F1F0ED",
} as const;

export const homepageSections = [
  { id: "hero", label: "Architecture · Interior · Visualisation", title: "Designing spaces that feel distinct." },
  { id: "studio", label: "The studio", title: "Spaces shaped by purpose." },
  { id: "walkthrough", label: "A closer look", title: "Step inside the design." },
  { id: "expertise", label: "Expertise", title: "What we do." },
  { id: "projects", label: "Selected work", title: "Spaces, made tangible." },
  { id: "materials", label: "Material language", title: "The details matter." },
  { id: "process", label: "The process", title: "From first thought to finished space." },
  { id: "philosophy", label: "The studio", title: "Designing with purpose." },
  { id: "contact", label: "Begin a conversation", title: "Have a space in mind?" },
  { id: "consultation", label: "Consultation", title: "Let's start a conversation." },
  { id: "interactive-process", label: "Interactive process", title: "Design, in motion." },
  { id: "locations", label: "Where we work", title: "From Pune, outward." },
  { id: "details", label: "Detail hotspots", title: "Look closer." },
] as const;

export const mediaPaths = {
  walkthroughVideo: "/animations/original-video.mp4",
  walkthroughPoster: "/animations/interior-walkthrough/frame_001.png",
  hero: "src/assets/uni-hero.jpg",
  studio: "src/assets/studio.jpg",
  mudra: "src/assets/mudra-living.jpg",
  materialDetail: "src/assets/mudra-detail.jpg",
  architectureStudy: "src/assets/architecture-study.jpg",
  interiorStudy: "src/assets/interior-study.jpg",
  consultation: "src/assets/cta-interior.jpg",
} as const;
