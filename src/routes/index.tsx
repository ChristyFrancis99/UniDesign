import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImage from "../assets/uni-hero.jpg";
import mudraImage from "../assets/mudra-living.jpg";
import detailImage from "../assets/mudra-detail.jpg";
import architectureImage from "../assets/architecture-study.jpg";
import interiorImage from "../assets/interior-study.jpg";
import studioImage from "../assets/studio.jpg";
import { Button } from "../components/ui/button";
import { SectionHeading } from "../components/section-heading";
import { ConsultationCta } from "../components/consultation-cta";
import { ContactForm } from "../components/contact-form";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "UnI Design Group | Architecture & Interior Design" }, { name: "description", content: "UnI Design Group creates thoughtful architecture, interiors and visualisations shaped around people, purpose and detail." }, { property: "og:title", content: "UnI Design Group | Architecture & Interior Design" }, { property: "og:description", content: "Thoughtful architecture, interiors and visualisations shaped around people, purpose and detail." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/" }] }),
  component: HomePage,
});

const services = [
  ["Architecture", "Spatial planning and architectural design"],
  ["Interior Design", "Thoughtful residential and commercial interiors"],
  ["3D Visualisation", "Visualising spaces before they are built"],
  ["Liaisoning & Sanctioning", "Coordination and approval services"],
];

function HomePage() {
  const [openService, setOpenService] = useState<number | null>(null);
  return <>
    <section className="relative flex min-h-[720px] h-[100svh] items-end overflow-hidden bg-foreground text-warm-white">
      <img src={heroImage} width={1920} height={1280} fetchPriority="high" alt="Contemporary residence with warm stone and timber interior" className="hero-reveal absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-foreground/25" />
      <div className="content-shell relative z-10 pb-20 md:pb-16">
        <p className="rise-in editorial-label mb-7 text-warm-white/80 [animation-delay:600ms]">Architecture · Interior · Visualisation</p>
        <h1 className="rise-in display-xl max-w-5xl [animation-delay:700ms]">DESIGNING<br />SPACES THAT<br />FEEL DISTINCT.</h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-end"><p className="rise-in max-w-md text-base leading-7 text-warm-white/80 [animation-delay:900ms]">UnI Design Group creates thoughtful architectural and interior environments shaped around people, purpose and detail.</p><div className="rise-in flex gap-8 md:justify-end [animation-delay:1100ms]"><Button asChild variant="inverse"><Link to="/projects">Explore projects</Link></Button><Button asChild variant="inverse"><Link to="/contact">Start a project →</Link></Button></div></div>
      </div>
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"><span className="editorial-label">Scroll</span><span className="line-down h-10 w-px bg-gold" /></div>
    </section>

    <section className="content-shell grid min-h-[680px] items-center gap-12 py-28 md:grid-cols-12"><div className="md:col-span-4"><p className="editorial-label text-gold">01 — The studio</p><div className="mt-7 h-px w-20 bg-gold" /></div><div className="md:col-span-8"><h2 className="display-lg">WE CREATE SPACES<br />WITH CHARACTER.</h2><p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">From architecture and interior design to 3D visualisation and liaisoning, UnI Design Group approaches every space through a balance of form, function and detail.</p></div></section>

    <section className="border-t border-border py-28"><div className="content-shell"><SectionHeading label="02 — Expertise" title="WHAT WE DO" /><div className="mt-16 border-t border-border">{services.map(([name, copy], index) => <div key={name} className="group border-b border-border transition-colors duration-500 hover:bg-foreground hover:text-warm-white"><button className="grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 px-3 py-7 text-left md:grid-cols-[100px_1fr_1fr_auto] md:px-8" onClick={() => setOpenService(openService === index ? null : index)} aria-expanded={openService === index}><span className="editorial-label text-gold">0{index + 1}</span><span className="font-display text-2xl md:text-4xl">{name}</span><span className="hidden text-sm text-muted-foreground group-hover:text-warm-white/60 md:block">{copy}</span><span className="text-xl transition-transform group-hover:translate-x-3" aria-hidden="true">{openService === index ? "−" : "+"}</span></button><div className={`overflow-hidden transition-all md:hidden ${openService === index ? "max-h-32 pb-7" : "max-h-0"}`}><p className="ml-[60px] pr-5 text-sm text-muted-foreground group-hover:text-warm-white/60">{copy}</p></div></div>)}</div></div></section>

    <section className="bg-secondary py-28"><div className="content-shell"><SectionHeading label="03 — Portfolio" title="SELECTED WORK" copy="A selection of spaces shaped through design, material and detail." />
      <article className="mt-20 grid items-center gap-10 md:grid-cols-12"><Link to="/projects/$slug" params={{ slug: "mudra" }} className="group overflow-hidden md:col-span-7"><img src={mudraImage} width={1600} height={1200} loading="lazy" alt="Mudra residence living room" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></Link><div className="md:col-span-4 md:col-start-9"><p className="editorial-label text-gold">01</p><h3 className="mt-5 font-display text-5xl">MUDRA</h3><p className="mt-4 text-sm uppercase leading-6 tracking-[0.12em] text-muted-foreground">3BHK Residence<br />Pune</p><Button asChild variant="editorial" className="mt-8"><Link to="/projects/$slug" params={{ slug: "mudra" }}>View project →</Link></Button></div></article>
      <article className="mt-28 grid items-center gap-10 md:grid-cols-12"><div className="order-2 md:order-1 md:col-span-4"><p className="editorial-label text-gold">02 · Visual study</p><h3 className="mt-5 font-display text-5xl">MATERIAL<br />COMPOSITION</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">An editorial exploration of crafted detail, texture and light.</p></div><Link to="/projects/$slug" params={{ slug: "interior-study" }} className="group order-1 overflow-hidden md:order-2 md:col-span-7 md:col-start-6"><img src={detailImage} width={1200} height={1600} loading="lazy" alt="Textural custom seating visual study" className="aspect-[5/4] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></Link></article>
      <article className="mt-28"><Link to="/projects/$slug" params={{ slug: "architecture-study" }} className="group block overflow-hidden"><img src={architectureImage} width={1808} height={1200} loading="lazy" alt="Courtyard architecture visual study" className="aspect-[16/8] w-full object-cover transition-transform duration-700 group-hover:scale-105" /></Link><div className="mt-7 flex items-end justify-between"><div><p className="editorial-label text-gold">03 · Visual study</p><h3 className="mt-3 font-display text-4xl">ARCHITECTURE & LIGHT</h3></div><Button asChild variant="editorial"><Link to="/projects">View all work →</Link></Button></div></article>
    </div></section>

    <section className="content-shell py-28"><SectionHeading label="04 — Our language" title="FORM. MATERIAL.\nLIGHT. DETAIL." /><div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-4">{[["Form","Proportion and geometry shape the character of a space."],["Material","Materials bring texture, warmth and identity."],["Light","Lighting defines how a space is perceived throughout the day."],["Detail","Small decisions create the finished experience."]].map(([title,copy],i) => <article key={title} className="border-t border-gold pt-6"><span className="editorial-label text-gold">0{i+1}</span><h3 className="mt-8 text-3xl">{title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></section>

    <section className="bg-secondary py-28"><div className="content-shell"><SectionHeading label="05 — Visualise" title="FROM VISION\nTO SPACE." /><Comparison /></div></section>

    <section className="bg-foreground py-28 text-warm-white"><div className="content-shell"><SectionHeading light label="06 — Categories" title="EXPLORE OUR WORK" /><div className="mt-16 divide-y divide-warm-white/15 border-t border-warm-white/15">{["Residential","Commercial","Architecture","Interiors","3D Visualisation"].map((category, i) => <Link key={category} to="/projects" search={{ category }} className="group flex items-center justify-between py-7"><span className="font-display text-3xl transition-transform group-hover:translate-x-4 group-hover:text-gold md:text-5xl">{category}</span><span className="editorial-label text-gold">0{i+1} →</span></Link>)}</div></div></section>

    <section className="content-shell grid gap-16 py-28 md:grid-cols-12 md:items-center"><div className="md:col-span-7"><img src={studioImage} width={1600} height={1104} loading="lazy" alt="UnI studio material table and design workspace" className="aspect-[4/3] w-full object-cover" /></div><div className="md:col-span-4 md:col-start-9"><p className="editorial-label text-gold">07 — About</p><h2 className="mt-7 display-lg">DESIGNING<br />WITH PURPOSE.</h2><p className="mt-7 leading-7 text-muted-foreground">UnI Design Group brings architecture, interior design and visualisation together to create considered spaces.</p><Button asChild variant="editorial" className="mt-8"><Link to="/about">Meet the studio →</Link></Button></div></section>

    <section className="bg-secondary py-28"><div className="content-shell grid gap-16 md:grid-cols-2 md:items-center"><img src={interiorImage} width={1408} height={1760} loading="lazy" alt="Editorial dining interior visual study" className="aspect-[4/5] w-full object-cover" /><div><p className="editorial-label text-gold">08 — The people</p><h2 className="mt-7 display-lg">THE PEOPLE<br />BEHIND THE<br />SPACES</h2><p className="mt-7 max-w-md text-muted-foreground">A studio working across architecture, interiors, visualisation and project coordination.</p><Button asChild variant="editorial" className="mt-8"><Link to="/about">Meet the team →</Link></Button></div></div></section>

    <section className="bg-foreground py-28 text-warm-white"><div className="content-shell"><SectionHeading light label="09 — Process" title="FROM IDEA\nTO REALITY." /><div className="relative mt-20 grid gap-10 md:grid-cols-5"><div className="absolute left-0 right-0 top-4 hidden h-px bg-warm-white/15 md:block"><div className="h-full w-4/5 bg-gold" /></div>{[["Discover","Understanding context and intent."],["Concept","Establishing the design direction."],["Visualise","Seeing the space before it is built."],["Develop","Resolving material and detail."],["Realise","Bringing the design into space."]].map(([title,copy],i) => <article key={title} className="relative"><span className="editorial-label text-gold">0{i+1}</span><h3 className="mt-8 text-3xl">{title}</h3><p className="mt-4 text-sm leading-6 text-warm-white/50">{copy}</p></article>)}</div></div></section>
    <ConsultationCta />
    <section className="content-shell grid gap-16 py-28 md:grid-cols-12"><div className="md:col-span-4"><SectionHeading label="10 — Contact" title="START YOUR\nPROJECT" copy="Tell us what you have in mind." /></div><div className="md:col-span-7 md:col-start-6"><ContactForm /></div></section>
  </>;
}

function Comparison() {
  const [position, setPosition] = useState(50);
  return <div className="relative mt-16 aspect-[16/9] min-h-[360px] overflow-hidden"><img src={architectureImage} alt="Architectural visualisation comparison" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100-position}% 0 0)` }}><img src={heroImage} alt="Completed interior comparison" className="h-full w-full object-cover" /></div><div className="pointer-events-none absolute inset-y-0 w-px bg-warm-white" style={{ left: `${position}%` }} /><input aria-label="Compare 3D visualisation and completed space" type="range" min="0" max="100" value={position} onChange={(e) => setPosition(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" /><span className="absolute bottom-5 left-5 editorial-label bg-foreground/80 px-3 py-2 text-warm-white">3D Visualisation</span><span className="absolute bottom-5 right-5 editorial-label bg-foreground/80 px-3 py-2 text-warm-white">Completed space</span></div>;
}
