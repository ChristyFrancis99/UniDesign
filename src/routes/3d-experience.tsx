import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/3d-experience")({
  component: ThreeDExperiencePage,
});

function ThreeDExperiencePage() {
  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#242424]">
      <section className="content-shell flex min-h-screen flex-col justify-center py-28 md:py-40">
        <p className="editorial-label text-gold">Spatial experience</p>
        <div className="mt-8 max-w-4xl">
          <h1 className="display-xl">A QUIET SPACE, BUILT TO BE EXPERIENCED.</h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Our interactive interior viewer is being refined for a smoother,
            more immersive experience across desktop and mobile. The portfolio
            remains available while the spatial viewer is prepared.
          </p>
        </div>

        <div className="mt-14 grid max-w-4xl gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-3">
          {[
            ["01", "Explore", "Move through considered interiors."],
            ["02", "Observe", "Study material, light and proportion."],
            ["03", "Experience", "Return when the interactive viewer is ready."],
          ].map(([number, title, description]) => (
            <div key={number} className="bg-[#f4f1eb] p-7 md:p-8">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-gold">{number}</p>
              <h2 className="mt-5 font-display text-2xl tracking-tight">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <Link
          to="/projects"
          className="editorial-label mt-12 inline-flex w-fit border-b border-gold pb-2 text-gold transition-opacity hover:opacity-70"
        >
          Explore the portfolio →
        </Link>
      </section>
    </main>
  );
}
