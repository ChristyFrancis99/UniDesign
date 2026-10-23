import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getProject } from "../../lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const project = getProject(params.slug);
    const title = project ? `${project.title} | UnI Design Group` : "Project Not Found | UnI Design Group";
    const description = project?.description ?? "Explore selected architecture and interior design work by UnI Design Group.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const project = getProject(slug);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const gallery = project?.gallery ?? [];
  const materials = project ? Object.values(project.materials).flat() : [];

  if (!project) {
    return <div className="content-shell flex min-h-[70vh] flex-col justify-center py-28 md:py-40"><p className="editorial-label text-gold">404 — Project not found</p><h1 className="mt-7 display-xl">THIS PROJECT DOESN'T EXIST.</h1><p className="mt-7 max-w-xl leading-8 text-muted-foreground">The project you are looking for may have moved or may not be part of the current portfolio.</p><Link to="/projects" className="mt-10 inline-block editorial-label text-gold">← Explore all projects</Link></div>;
  }

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden bg-foreground text-warm-white">
        <img src={project.heroImage} alt={gallery[0]?.alt ?? project.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-foreground/20" />
        <div className="content-shell relative z-10 flex min-h-[78vh] items-end pb-16 md:pb-24">
          <div><p className="editorial-label text-gold">Selected work</p><h1 className="mt-6 display-xl">{project.title.toUpperCase()}</h1><p className="mt-6 text-sm uppercase tracking-[0.12em] text-warm-white/70">{project.type ?? (project.isStudy ? "Visual Study" : project.category)} · {project.location ?? "Studio"}</p></div>
        </div>
      </section>

      <section className="content-shell grid gap-12 py-28 md:grid-cols-12">
        <div className="md:col-span-4"><p className="editorial-label text-gold">Project — Approach</p><div className="mt-7 h-px w-20 bg-gold" /></div>
        <div className="md:col-span-7 md:col-start-6"><p className="text-xl leading-9 text-muted-foreground">{project.description}</p><p className="mt-8 leading-8 text-muted-foreground">The project brings together architecture, interiors and visualisation to create a coherent spatial experience. Material, light and proportion guide each decision.</p></div>
      </section>

      <section className="bg-secondary py-24"><div className="content-shell"><div className="mb-12 flex items-end justify-between"><div><p className="editorial-label text-gold">Project gallery</p><h2 className="mt-4 display-lg">DETAILS IN<br />FOCUS.</h2></div><p className="hidden editorial-label text-muted-foreground md:block">Click an image to expand</p></div><div className="grid gap-6 md:grid-cols-12">{gallery.map((image, index) => <button data-cursor="OPEN" key={`${image.src}-${index}`} onClick={() => setLightbox(index)} className={`group overflow-hidden text-left ${index === 0 ? "md:col-span-8" : "md:col-span-4"}`}><img src={image.src} alt={image.alt} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${image.shape === "wide" ? "aspect-[4/3]" : image.shape === "portrait" ? "aspect-[3/4]" : "aspect-square"}`} /></button>)}</div></div></section>

      {materials.length > 0 && <section className="content-shell grid gap-16 py-28 md:grid-cols-12"><div className="md:col-span-4"><p className="editorial-label text-gold">Material palette</p><h2 className="mt-6 display-lg">THE QUIET<br />DETAILS.</h2></div><div className="grid gap-0 md:col-span-7 md:col-start-6">{materials.map((material, index) => <div key={material} className="flex items-center justify-between border-t border-border py-6"><span className="font-display text-2xl">{material}</span><span className="editorial-label text-gold">{String(index + 1).padStart(2, "0")}</span></div>)}</div></section>}

      <section className="bg-foreground py-28 text-warm-white"><div className="content-shell grid gap-10 md:grid-cols-2 md:items-end"><div><p className="editorial-label text-gold">Continue exploring</p><h2 className="mt-6 display-lg">MORE SPACES<br />BY UN<span className="text-gold">I</span>.</h2></div><div className="md:text-right"><Link data-cursor="EXPLORE" to="/projects" className="editorial-label text-gold">← Back to all projects</Link></div></div></section>

      {lightbox !== null && <div role="dialog" aria-modal="true" aria-label="Project image viewer" className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 p-5 text-warm-white" onClick={() => setLightbox(null)}><button aria-label="Close image viewer" className="absolute right-6 top-6 text-3xl" onClick={() => setLightbox(null)}>×</button><img src={gallery[lightbox]?.src} alt={gallery[lightbox]?.alt ?? project.title} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={(event) => event.stopPropagation()} /><div className="absolute bottom-6 left-1/2 -translate-x-1/2 editorial-label">{lightbox + 1} / {gallery.length}</div><button aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl md:left-8" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}>←</button><button aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl md:right-8" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}>→</button></div>}
    </div>
  );
}
