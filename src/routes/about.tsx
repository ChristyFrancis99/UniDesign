import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div className="content-shell py-28 md:py-40">
      <p className="editorial-label text-gold">About — The studio</p>
      <h1 className="mt-7 display-xl max-w-5xl">DESIGNING WITH PURPOSE.</h1>
      <div className="mt-14 grid gap-12 md:grid-cols-12">
        <p className="text-lg leading-8 text-muted-foreground md:col-span-7">
          UnI Design Group brings architecture, interior design and visualisation together to create considered spaces shaped around people, purpose and detail.
        </p>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm leading-7 text-muted-foreground">
            Architecture · Interior · Visualisation · Liaisoning & Sanctioning
          </p>
        </div>
      </div>
      <div className="mt-20 border-t border-border pt-8">
        <Link to="/" className="editorial-label text-gold">← Back home</Link>
      </div>
    </div>
  );
}
