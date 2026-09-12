import { createFileRoute, Link } from "@tanstack/react-router";
import architectureImage from "../../assets/architecture-study.jpg";
import mudraImage from "../../assets/mudra-living.jpg";
import detailImage from "../../assets/mudra-detail.jpg";

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: ProjectsPage,
});

const projects = [
  { slug: "mudra", title: "MUDRA", type: "3BHK Residence · Pune", categories: ["Residential", "Interiors"], image: mudraImage },
  { slug: "interior-study", title: "MATERIAL COMPOSITION", type: "Visual Study", categories: ["Interiors", "3D Visualisation"], image: detailImage },
  { slug: "architecture-study", title: "ARCHITECTURE & LIGHT", type: "Visual Study", categories: ["Architecture", "3D Visualisation"], image: architectureImage },
];

function ProjectsPage() {
  const { category } = Route.useSearch();
  const normalizedCategory = category?.trim().toLowerCase();
  const filteredProjects = normalizedCategory
    ? projects.filter((project) => project.categories.some((item) => item.toLowerCase() === normalizedCategory))
    : projects;

  return (
    <div className="content-shell py-28 md:py-40">
      <p className="editorial-label text-gold">Portfolio — Selected work</p>
      <h1 className="mt-7 display-xl">{category ? `${category.toUpperCase()}.` : "EXPLORE OUR WORK."}</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground">
        {category ? `Showing projects related to ${category}.` : "A selection of spaces shaped through design, material and detail."}
      </p>
      <div className="mt-20 grid gap-16">
        {filteredProjects.map((project, index) => (
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
        {filteredProjects.length === 0 && (
          <div className="border-t border-border pt-10">
            <p className="text-lg text-muted-foreground">No projects are currently listed in this category.</p>
            <Link to="/projects" className="mt-6 inline-block editorial-label text-gold">View all work →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
