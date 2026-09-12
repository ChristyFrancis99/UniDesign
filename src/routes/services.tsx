import { createFileRoute, Link } from "@tanstack/react-router";

const services = [
  { number: "01", title: "Architecture", text: "Context-led architectural design from concept through considered documentation and execution." },
  { number: "02", title: "Interior Design", text: "Layered residential and commercial interiors shaped by material, light, proportion and everyday use." },
  { number: "03", title: "3D Visualisation", text: "Photoreal visualisation that helps clients experience form, atmosphere and material before construction." },
  { number: "04", title: "Liaisoning & Sanctioning", text: "Practical support through approvals, coordination and sanctioning requirements for a smoother project journey." },
];

export const Route = createFileRoute("/services")({ component: ServicesPage });

function ServicesPage() {
  return (
    <main className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="content-shell">
        <div className="motion-reveal">
          <p className="editorial-label text-gold">Services — What we do</p>
          <h1 className="mt-7 display-xl max-w-5xl">FROM FIRST LINE TO FINAL DETAIL.</h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">Architecture, interiors, visualisation and liaisoning brought together as one considered design process.</p>
        </div>

        <div className="mt-24 divide-y border-y border-border motion-stagger">
          {services.map((service, index) => (
            <article key={service.number} className="motion-reveal group grid gap-6 py-10 md:grid-cols-12 md:items-center md:py-14" style={{ "--motion-index": index } as React.CSSProperties}>
              <span className="editorial-label text-gold md:col-span-1">{service.number}</span>
              <h2 className="font-display text-4xl md:col-span-4 md:text-5xl">{service.title}</h2>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground md:col-span-5 md:col-start-8">{service.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8 motion-reveal">
          <p className="text-sm text-muted-foreground">Have a space, site or idea in mind?</p>
          <Link to="/contact" className="editorial-label text-gold hover:text-foreground">Start a conversation →</Link>
        </div>
      </div>
    </main>
  );
}
