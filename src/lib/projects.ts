import heroImage from "../assets/uni-hero.jpg";
import mudraLiving from "../assets/mudra-living.jpg";
import mudraDetail from "../assets/mudra-detail.jpg";
import architectureStudy from "../assets/architecture-study.jpg";
import interiorStudy from "../assets/interior-study.jpg";

export type Project = {
  title: string;
  slug: string;
  category: "Residential" | "Architecture" | "Interiors" | "3D Visualisation";
  location?: string;
  type?: string;
  description: string;
  heroImage: string;
  gallery: { src: string; alt: string; shape: "wide" | "portrait" | "square" }[];
  year?: string;
  details?: Record<string, string>;
  model3D: string | null;
  hotspots: { id: string; title: string; description: string; position: [number, number, number] }[];
  cameraPositions: Record<string, { position: [number, number, number]; target: [number, number, number] }>;
  materials: Record<string, string[]>;
  isStudy?: boolean;
};

export const projects: Project[] = [
  {
    title: "Mudra",
    slug: "mudra",
    category: "Residential",
    location: "Pune",
    type: "3BHK Residence",
    description: "A residential interior shaped through material, proportion and detail.",
    heroImage: mudraLiving,
    gallery: [
      { src: mudraLiving, alt: "Warm contemporary living room at Mudra residence", shape: "wide" },
      { src: mudraDetail, alt: "Custom seating and brass lighting detail", shape: "portrait" },
      { src: heroImage, alt: "Open living and dining space with natural materials", shape: "wide" },
      { src: interiorStudy, alt: "Dining space framed by dark timber", shape: "portrait" },
    ],
    details: { Type: "Residential", Location: "Pune", Scope: "Interior Design", Approach: "Concept • Space • Material • Detail" },
    model3D: null,
    hotspots: [],
    cameraPositions: {},
    materials: {},
  },
  {
    title: "Architecture Study",
    slug: "architecture-study",
    category: "Architecture",
    description: "An editorial visual study of structure, landscape and light.",
    heroImage: architectureStudy,
    gallery: [{ src: architectureStudy, alt: "Contemporary courtyard architecture study", shape: "wide" }],
    model3D: null,
    hotspots: [],
    cameraPositions: {},
    materials: {},
    isStudy: true,
  },
  {
    title: "Interior Study",
    slug: "interior-study",
    category: "Interiors",
    description: "An editorial visual study exploring quiet material contrasts.",
    heroImage: interiorStudy,
    gallery: [
      { src: interiorStudy, alt: "Sculptural dining interior visual study", shape: "portrait" },
      { src: mudraDetail, alt: "Textural seating detail visual study", shape: "portrait" },
    ],
    model3D: null,
    hotspots: [],
    cameraPositions: {},
    materials: {},
    isStudy: true,
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);