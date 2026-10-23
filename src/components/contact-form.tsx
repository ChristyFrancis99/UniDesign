import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const projectTypes = ["Residential Interior", "Commercial Interior", "Architecture", "3D Visualisation", "Liaisoning & Sanctioning", "Other"];

const fieldClass = "mt-3 h-12 rounded-none !border-0 !border-b !border-border bg-transparent px-0 shadow-none focus:!border-0 focus-visible:!border-0 focus-visible:!ring-0 focus-visible:!outline-none placeholder:text-muted-foreground/60";
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();

export function ContactForm() {
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!contactEmail) {
      setStatus({
        kind: "error",
        message: "This enquiry form is not connected yet. Please configure VITE_CONTACT_EMAIL to enable email hand-off.",
      });
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const location = String(data.get("location") ?? "").trim();
    const projectType = String(data.get("projectType") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Project enquiry — ${name}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, `Location: ${location || "Not provided"}`, `Project type: ${projectType}`, "", "Project details:", message].join("\n"),
    );

    setStatus({
      kind: "success",
      message: "Your email app should open with the enquiry details. Review and send the email there to complete delivery.",
    });
    window.location.href = `mailto:${encodeURIComponent(contactEmail)}?subject=${subject}&body=${body}`;
  };

  return <form onSubmit={submit} className="grid gap-x-8 gap-y-8 md:grid-cols-2">
    <label className="editorial-label">Name<Input name="name" required autoComplete="name" placeholder="Your name" className={fieldClass} /></label>
    <label className="editorial-label">Email<Input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} /></label>
    <label className="editorial-label">Phone<Input name="phone" type="tel" required autoComplete="tel" placeholder="+91 00000 00000" className={fieldClass} /></label>
    <label className="editorial-label">Location<Input name="location" autoComplete="address-level2" placeholder="City / Location" className={fieldClass} /></label>
    <label className="editorial-label md:col-span-2">Project type<select name="projectType" required defaultValue="" className="mt-3 h-12 w-full border-x-0 border-t-0 border-b border-border bg-transparent text-sm font-normal outline-none focus:border-gold"><option value="" disabled>Select a project type</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
    <label className="editorial-label md:col-span-2">Tell us about your project<Textarea name="message" required rows={5} placeholder="Tell us about your space, location, requirements and vision..." className="mt-3 rounded-none !border-0 !border-b !border-border bg-transparent px-0 shadow-none focus:!border-0 focus-visible:!border-0 focus-visible:!ring-0 focus-visible:!outline-none placeholder:text-muted-foreground/60" /></label>
    <div className="md:col-span-2">
      <Button type="submit" variant="editorial">Prepare enquiry <span aria-hidden>→</span></Button>
      {status && <p role="status" aria-live="polite" className={`mt-5 text-sm ${status.kind === "error" ? "text-destructive" : "text-muted-foreground"}`}>{status.message}</p>}
    </div>
  </form>;
}
