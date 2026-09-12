import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const projectTypes = ["Residential Interior", "Commercial Interior", "Architecture", "3D Visualisation", "Liaisoning & Sanctioning", "Other"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    setSent(true);
    event.currentTarget.reset();
  };
  return <form onSubmit={submit} className="grid gap-x-8 gap-y-8 md:grid-cols-2">
    <label className="editorial-label">Name<Input name="name" required autoComplete="name" className="mt-3 h-12 rounded-none border-x-0 border-t-0 px-0 shadow-none" /></label>
    <label className="editorial-label">Email<Input name="email" type="email" required autoComplete="email" className="mt-3 h-12 rounded-none border-x-0 border-t-0 px-0 shadow-none" /></label>
    <label className="editorial-label">Phone<Input name="phone" type="tel" required autoComplete="tel" className="mt-3 h-12 rounded-none border-x-0 border-t-0 px-0 shadow-none" /></label>
    <label className="editorial-label">Location<Input name="location" autoComplete="address-level2" className="mt-3 h-12 rounded-none border-x-0 border-t-0 px-0 shadow-none" /></label>
    <label className="editorial-label md:col-span-2">Project type<select name="projectType" required defaultValue="" className="mt-3 h-12 w-full border-x-0 border-t-0 border-b border-input bg-transparent text-sm font-normal outline-none focus:border-gold"><option value="" disabled>Select a project type</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
    <label className="editorial-label md:col-span-2">Tell us about your project<Textarea name="message" required rows={5} className="mt-3 rounded-none border-x-0 border-t-0 px-0 shadow-none" /></label>
    <div className="md:col-span-2"><Button type="submit" variant="editorial">Send enquiry <span aria-hidden>→</span></Button>{sent && <p role="status" className="mt-5 text-sm text-muted-foreground">Thank you. Your enquiry has been prepared. Direct delivery will be connected when business contact details are provided.</p>}</div>
  </form>;
}