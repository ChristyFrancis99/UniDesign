import { createFileRoute, Link } from "@tanstack/react-router";
import architectureImage from "../../assets/architecture-study.jpg";
import mudraImage from "../../assets/mudra-living.jpg";
import detailImage from "../../assets/mudra-detail.jpg";

export const Route = createFileRoute("/projects/")({ component: ProjectsPage });

const projects = [
  { slug: "mudra", title: "MUDRA", type: "3BHK Residence · Pune", image: mudraImage },
  { slug: "interior-study", title: "MATERIAL COMPOSITION", type: "Visual Study", image: detailImage },
  { slug: "architecture-study", title: "ARCHITECTURE & LIGHT", type: "Visual Study", image: architectureImage },
];

function ProjectsPage() {
  return (
    <div className="content-shell py-28 md:py-40">
      <p className="editorial-label text-gold">Portfolio — Selected work</p>
      <h1 className="mt-7 display-xl">EXPLORE OUR WORK.</h1>
      <div className="mt-20 grid gap-16">
        {projects.map((project, index) => (
          <article key={project.slug} className="grid gap-8 md:grid-cols-12 md:items-end">
            <Link to="/projects/$slug" params={{ slug: project.slug }} className="group overflow-hidden md:col-span-8">
              <img src={project.image} alt={project.title} className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </Link>
            <div className="md:col-span-3 md:col-start-10">
              <p className="editorial-label text-gold">0{index + 1}</p>
              <h2 className="mt-4 font-display text-4xl">{project.title}</h2>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-muted-foreground">{project.type}</p>
              <Link to="/projects/$slug" params={{ slug: project.slug }} className="mt-7 inline-block editorial-label text-gold">View project →</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
