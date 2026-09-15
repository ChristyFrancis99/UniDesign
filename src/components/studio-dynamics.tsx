import { useState } from "react";
import { Link } from "@tanstack/react-router";
import mudraImage from "../assets/mudra-living.jpg";
import detailImage from "../assets/mudra-detail.jpg";
import architectureImage from "../assets/architecture-study.jpg";
import interiorImage from "../assets/interior-study.jpg";
import { SectionHeading } from "./section-heading";

const process = [
  ["Discover", "We understand the site, brief, lifestyle and ambitions before a line is drawn.", "01"],
  ["Concept", "A clear spatial direction establishes proportion, mood, circulation and character.", "02"],
  ["Visualise", "Materials, lighting and atmosphere are explored so decisions become tangible early.", "03"],
  ["Develop", "Drawings, finishes, joinery and details are resolved into a buildable language.", "04"],
  ["Realise", "The design is coordinated through execution so the final space stays true to the intent.", "05"],
] as const;

const testimonials = [
  ["“The design feels considered from every angle. Nothing feels added just for the sake of it.”", "Residential client", "Pune"],
  ["“The team translated a loose idea into a space that feels calm, practical and distinctly ours.”", "Private residence", "Pune"],
  ["“Material, lighting and proportion were handled with exceptional attention to detail.”", "Studio collaboration", "Maharashtra"],
] as const;

const locations = [
  ["Pune", "Residential", "01"],
  ["Mumbai", "Interiors", "02"],
  ["Maharashtra", "Architecture", "03"],
] as const;

export function StudioDynamics() {
  return (
    <>
      <ProcessExplorer />
      <Testimonials />
      <ProjectMap />
      <ProjectHotspots />
    </>
  );
}

function ProcessExplorer() {
  const [active, setActive] = useState(0);
  const current = process[active];
  return (
    <section className="bg-foreground py-28 text-warm-white">
      <div className="content-shell">
        <SectionHeading light label="13 — Interactive process" title="DESIGN, IN MOTION." copy="Move through the studio process. Each stage reveals the thinking behind the next decision." />
        <div className="mt-16 grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <div className="overflow-hidden border border-warm-white/15"><img src={[mudraImage, detailImage, architectureImage, interiorImage, mudraImage][active]} alt={`${current[0]} stage`} className="aspect-[4/3] w-full object-cover transition-all duration-700" /></div>
            <div className="mt-5 flex items-center justify-between editorial-label text-warm-white/45"><span>STUDIO METHOD</span><span>{current[2]} / 05</span></div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-display text-6xl text-gold md:text-8xl">{current[2]}</p><h3 className="mt-3 font-display text-5xl md:text-7xl">{current[0]}</h3><p className="mt-6 max-w-xl text-lg leading-8 text-warm-white/60">{current[1]}</p>
            <div className="mt-10 divide-y divide-warm-white/15 border-t border-warm-white/15">{process.map(([title, , number], index) => <button key={title} onClick={() => setActive(index)} aria-pressed={active === index} className={`flex w-full items-center justify-between py-5 text-left ${active === index ? "text-gold" : "text-warm-white/60 hover:text-warm-white"}`}><span className="font-display text-2xl">{title}</span><span className="editorial-label">{number}</span></button>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const item = testimonials[active];
  return (
    <section className="bg-secondary py-28"><div className="content-shell grid gap-14 md:grid-cols-12 md:items-end"><div className="md:col-span-4"><SectionHeading label="14 — Client perspective" title="SPACES THAT STAY WITH YOU." /></div><div className="md:col-span-7 md:col-start-6"><div className="min-h-[260px] border-t border-border pt-10"><p className="font-display text-4xl leading-tight md:text-6xl">{item[0]}</p><div className="mt-10 flex items-end justify-between gap-6"><div><p className="editorial-label text-gold">{item[1]}</p><p className="mt-2 text-sm text-muted-foreground">{item[2]}</p></div><div className="flex gap-2">{testimonials.map((testimonial, index) => <button key={testimonial[1]} aria-label={`Show testimonial ${index + 1}`} onClick={() => setActive(index)} className={`h-2.5 w-10 rounded-full border ${active === index ? "bg-gold border-gold" : "border-border bg-transparent"}`} />)}</div></div></div></div></div></section>
  );
}

function ProjectMap() {
  const [active, setActive] = useState(0);
  const location = locations[active];
  return (
    <section className="content-shell py-28"><SectionHeading label="15 — Where we work" title="FROM PUNE, OUTWARD." copy="Explore the kinds of work currently represented across the studio portfolio." /><div className="mt-16 grid gap-8 md:grid-cols-12"><div className="relative min-h-[380px] overflow-hidden bg-foreground text-warm-white md:col-span-7"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)", backgroundSize: "56px 56px" }} /><div className="absolute left-[28%] top-[38%] h-44 w-44 rounded-full border border-gold/40" /><div className="absolute left-[38%] top-[48%] h-24 w-24 rounded-full border border-gold/30" />{locations.map(([name, , number], index) => <button key={name} onClick={() => setActive(index)} className={`absolute ${["left-[44%] top-[49%]", "left-[61%] top-[34%]", "left-[25%] top-[63%]"][index]} group`} aria-label={`Explore ${name}`}><span className={`block h-4 w-4 rounded-full border-2 ${active === index ? "scale-125 border-gold bg-gold" : "border-warm-white bg-foreground"} transition-transform`} /><span className="absolute left-6 top-0 whitespace-nowrap font-display text-xl opacity-0 transition-opacity group-hover:opacity-100">{name}</span><span className="absolute -left-1 -top-6 editorial-label text-gold">{number}</span></button>)}<div className="absolute bottom-6 left-6"><p className="editorial-label text-gold">STUDIO / INDIA</p><p className="mt-2 text-sm text-warm-white/50">A growing body of residential and design work.</p></div></div><div className="md:col-span-5 md:flex md:flex-col md:justify-between"><div><p className="editorial-label text-gold">Selected location</p><h3 className="mt-5 font-display text-6xl">{location[0]}</h3><p className="mt-3 text-sm uppercase tracking-[.14em] text-muted-foreground">{location[1]}</p></div><div className="mt-10 divide-y border-t border-border">{locations.map(([name, type], index) => <button key={name} onClick={() => setActive(index)} className={`flex w-full items-center justify-between py-5 text-left ${active === index ? "text-gold" : "text-foreground"}`}><span className="font-display text-2xl">{name}</span><span className="editorial-label">{type}</span></button>)}</div><Link to="/projects" data-cursor="EXPLORE" className="mt-8 inline-block editorial-label text-gold">Explore selected work →</Link></div></div></section>
  );
}

function ProjectHotspots() {
  const hotspots = [
    ["Crafted joinery", "01", "left-[25%] top-[55%]"],
    ["Layered lighting", "02", "left-[64%] top-[35%]"],
    ["Material balance", "03", "left-[74%] top-[68%]"],
  ] as const;
  const [active, setActive] = useState(0);
  const current = hotspots[active];
  return (
    <section className="bg-secondary py-28"><div className="content-shell"><SectionHeading label="16 — Detail hotspots" title="LOOK CLOSER." copy="Tap a detail point to explore the design language behind the image." /><div className="mt-16 grid gap-10 md:grid-cols-12 md:items-end"><div className="relative overflow-hidden md:col-span-8"><img src={mudraImage} alt="Mudra residence interior detail" className="aspect-[4/3] w-full object-cover" />{hotspots.map(([label, number, position], index) => <button key={label} onClick={() => setActive(index)} className={`absolute ${position} grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border ${active === index ? "border-gold bg-gold text-foreground scale-110" : "border-warm-white bg-foreground/70 text-warm-white"}`} aria-label={label}><span className="editorial-label">{number}</span></button>)}</div><div className="md:col-span-4"><p className="editorial-label text-gold">{current[1]}</p><h3 className="mt-4 font-display text-5xl">{current[0]}</h3><p className="mt-5 leading-7 text-muted-foreground">A considered layer of the composition, selected to support the overall rhythm of the space.</p></div></div></div></section>
  );
}
