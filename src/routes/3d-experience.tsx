import { createFileRoute, Link } from "@tanstack/react-router";
import { Interactive3DExperience } from "../components/interactive-3d-experience";

export const Route = createFileRoute("/3d-experience")({
  component: ThreeDExperiencePage,
});

function ThreeDExperiencePage() {
  return (
    <main className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="content-shell">
        <div className="motion-reveal">
          <p className="editorial-label text-gold">
            3D Experience — Interactive space
          </p>
          <h1 className="mt-7 display-xl max-w-5xl">STEP INSIDE THE DESIGN.</h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Explore the interior in real time. Orbit around the space, move
            between rooms, and zoom in to inspect the design.
          </p>
        </div>

        <section
          aria-label="Interactive 3D interior"
          className="relative mt-20 motion-reveal"
          data-motion="scale"
        >
          <Interactive3DExperience />
        </section>

        <div className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-3 motion-stagger">
          {["Orbit the space", "Explore rooms", "Understand the light"].map(
            (item, index) => (
              <div key={item} className="motion-reveal">
                <span className="editorial-label text-gold">0{index + 1}</span>
                <h2 className="mt-4 font-display text-3xl">{item}</h2>
              </div>
            ),
          )}
        </div>

        <div className="mt-16 border-t border-border pt-8 motion-reveal">
          <Link
            to="/projects"
            className="editorial-label text-gold hover:text-foreground"
          >
            Explore selected work →
          </Link>
        </div>
      </div>
    </main>
  );
}
