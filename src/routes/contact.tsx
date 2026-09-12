import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "../components/contact-form";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <div className="content-shell py-28 md:py-40">
      <p className="editorial-label text-gold">Contact — Start a project</p>
      <div className="mt-7 grid gap-12 md:grid-cols-12 md:items-end">
        <h1 className="display-xl md:col-span-8">LET'S CREATE YOUR SPACE.</h1>
        <p className="leading-7 text-muted-foreground md:col-span-4">
          Tell us what you have in mind and we will take it from concept to considered space.
        </p>
      </div>
      <div className="mt-20 max-w-3xl">
        <ContactForm />
      </div>
      <div className="mt-16 border-t border-border pt-8">
        <Link to="/" className="editorial-label text-gold">← Back home</Link>
      </div>
    </div>
  );
}
