import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/3d-experience")({ component: ThreeDExperiencePage });

function ThreeDExperiencePage() {
  return (
    <main className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="content-shell">
        <div className="motion-reveal">
          <p className="editorial-label text-gold">3D Experience — Interactive space</p>
          <h1 className="mt-7 display-xl max-w-5xl">STEP INSIDE THE DESIGN.</h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">An interactive environment for exploring material, light, proportion and spatial relationships. Your production-ready 3D model can be placed in the experience area below.</p>
        </div>

        <section aria-label="3D model placeholder" className="relative mt-20 min-h-[55vh] overflow-hidden border border-border bg-secondary-charcoal motion-reveal" data-motion="scale">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_48%)]" />
          <div className="absolute left-6 top-6 editorial-label text-warm-white/60">3D MODEL / PLACEHOLDER</div>
          <div className="relative flex min-h-[55vh] items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto mb-7 h-20 w-20 border border-gold/60 rotate-45 transition-transform duration-700 hover:rotate-[135deg]" aria-hidden />
              <p className="font-display text-3xl text-warm-white md:text-5xl">Your 3D model goes here.</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-warm-white/55">Replace this placeholder with the WebGL / Three.js / embedded model experience when your final asset is ready.</p>
            </div>
          </div>
        </section>

        <div className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-3 motion-stagger">
          {["Orbit the space", "Explore materials", "Understand the light"].map((item, index) => (
            <div key={item} className="motion-reveal" style={{ "--motion-index": index } as React.CSSProperties}>
              <span className="editorial-label text-gold">0{index + 1}</span>
              <h2 className="mt-4 font-display text-3xl">{item}</h2>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8 motion-reveal">
          <Link to="/projects" className="editorial-label text-gold hover:text-foreground">Explore selected work →</Link>
        </div>
      </div>
    </main>
  );
}
