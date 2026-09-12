import { createFileRoute, Link } from "@tanstack/react-router";
import mudraImage from "../../assets/mudra-living.jpg";
import detailImage from "../../assets/mudra-detail.jpg";
import architectureImage from "../../assets/architecture-study.jpg";

export const Route = createFileRoute("/projects/$slug")({ component: ProjectPage });

const projectData: Record<string, { title: string; type: string; description: string; image: string }> = {
  mudra: { title: "MUDRA", type: "3BHK Residence · Pune", description: "A considered residential environment shaped through proportion, material, light and detail.", image: mudraImage },
  "interior-study": { title: "MATERIAL COMPOSITION", type: "Visual Study", description: "An editorial exploration of crafted detail, texture and light.", image: detailImage },
  "architecture-study": { title: "ARCHITECTURE & LIGHT", type: "Visual Study", description: "A study of courtyard geometry, shadow and the relationship between built form and natural light.", image: architectureImage },
};

function ProjectPage() {
  const { slug } = Route.useParams();
  const project = projectData[slug] ?? projectData.mudra;

  return (
    <div>
      <section className="relative min-h-[70vh] overflow-hidden bg-foreground text-warm-white">
        <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-foreground/35" />
        <div className="content-shell relative z-10 flex min-h-[70vh] items-end pb-16 md:pb-24">
          <div>
            <p className="editorial-label text-gold">Selected work</p>
            <h1 className="mt-6 display-xl">{project.title}</h1>
            <p className="mt-6 text-sm uppercase tracking-[0.12em] text-warm-white/70">{project.type}</p>
          </div>
        </div>
      </section>
      <section className="content-shell grid gap-12 py-28 md:grid-cols-12">
        <p className="editorial-label text-gold md:col-span-4">Project — Approach</p>
        <div className="md:col-span-7 md:col-start-6">
          <p className="text-xl leading-9 text-muted-foreground">{project.description}</p>
          <p className="mt-8 leading-8 text-muted-foreground">The project brings together architecture, interiors and visualisation to create a coherent spatial experience. Material, light and proportion guide each decision.</p>
        </div>
      </section>
      <section className="bg-secondary py-20">
        <div className="content-shell">
          <Link to="/projects" className="editorial-label text-gold">← Back to projects</Link>
        </div>
      </section>
    </div>
  );
}
