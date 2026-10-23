import { Link, createFileRoute } from "@tanstack/react-router";
import { projects } from "../../lib/projects";

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>) => ({ category: typeof search.category === "string" ? search.category : undefined }),
  head: () => ({
    meta: [
      { title: "Selected Projects | UnI Design Group" },
      { name: "description", content: "Explore selected architecture, interior design and visualisation projects by UnI Design Group." },
      { property: "og:title", content: "Selected Projects | UnI Design Group" },
      { property: "og:description", content: "Explore selected architecture, interior design and visualisation projects by UnI Design Group." },
    ],
  }),
  component: ProjectsPage,
});

const projectCategories = Array.from(new Set(projects.flatMap((project) => [
  project.category,
  ...(project.isStudy ? ["3D Visualisation"] : []),
]))).sort((a, b) => a.localeCompare(b));

function categoriesFor(project: (typeof projects)[number]) {
  return [project.category, ...(project.isStudy ? ["3D Visualisation" as const] : [])];
}

function ProjectsPage() {
  const { category } = Route.useSearch();
  const selectedCategory = projectCategories.find((item) => item.toLowerCase() === category?.trim().toLowerCase());
  const filteredProjects = selectedCategory
    ? projects.filter((project) => categoriesFor(project).some((item) => item.toLowerCase() === selectedCategory.toLowerCase()))
    : projects;

  return (
    <div className="content-shell py-28 md:py-40">
      <p className="editorial-label text-gold">Portfolio — Selected work</p>
      <h1 className="mt-7 display-xl">{selectedCategory ? `${selectedCategory.toUpperCase()}.` : "EXPLORE OUR WORK."}</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground">{selectedCategory ? `Showing projects related to ${selectedCategory}.` : "A selection of spaces shaped through design, material and detail."}</p>

      <nav aria-label="Project categories" className="mt-12 flex flex-wrap gap-x-7 gap-y-4 border-y border-border py-5">
        {[ "All", ...projectCategories ].map((filter) => {
          const active = filter === "All" ? !selectedCategory : selectedCategory === filter;
          return <Link key={filter} to="/projects" search={filter === "All" ? {} : { category: filter }} className={`editorial-label border-b py-2 transition-colors ${active ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{filter}</Link>;
        })}
      </nav>

      <div className="mt-20 grid gap-20">
        {filteredProjects.map((project, index) => (
          <article key={project.slug} className="grid gap-8 md:grid-cols-12 md:items-end">
            <Link data-cursor="VIEW PROJECT" to="/projects/$slug" params={{ slug: project.slug }} className="project-image-wrap group md:col-span-8">
              <img src={project.heroImage} alt={project.gallery[0]?.alt ?? project.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
              <span className="project-hover-label editorial-label">View project ↗</span>
            </Link>
            <div className="md:col-span-3 md:col-start-10">
              <p className="editorial-label text-gold">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 font-display text-4xl">{project.title.toUpperCase()}</h2>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-muted-foreground">{project.type ?? (project.isStudy ? "Visual Study" : project.category)}{project.location ? ` · ${project.location}` : ""}</p>
              <div className="mt-4 flex flex-wrap gap-2">{categoriesFor(project).map((item) => <span key={item} className="border border-border px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{item}</span>)}</div>
              <Link data-cursor="VIEW" to="/projects/$slug" params={{ slug: project.slug }} className="mt-7 inline-block editorial-label text-gold">View project →</Link>
            </div>
          </article>
        ))}
        {filteredProjects.length === 0 && <div className="border-t border-border pt-10"><p className="text-lg text-muted-foreground">No projects are currently listed in this category.</p><Link to="/projects" className="mt-6 inline-block editorial-label text-gold">View all work →</Link></div>}
      </div>
    </div>
  );
}
