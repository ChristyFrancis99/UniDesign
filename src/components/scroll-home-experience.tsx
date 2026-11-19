import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroImage from "../assets/uni-hero.jpg";
import mudraImage from "../assets/mudra-living.jpg";
import detailImage from "../assets/mudra-detail.jpg";
import architectureImage from "../assets/architecture-study.jpg";
import interiorImage from "../assets/interior-study.jpg";
import studioImage from "../assets/studio.jpg";
import { Button } from "./ui/button";
import { SectionHeading } from "./section-heading";
import { InteriorWalkthrough } from "./interior-walkthrough";
import { ConsultationCta } from "./consultation-cta";
import { ContactForm } from "./contact-form";
import { StudioDynamics } from "./studio-dynamics";

const services = [
  ["Architecture", "Spatial planning and architectural design", "01"],
  ["Interior Design", "Thoughtful residential and commercial interiors", "02"],
  ["3D Visualisation", "Visualising spaces before they are built", "03"],
  ["Liaisoning & Sanctioning", "Coordination and approval services", "04"],
];

const projects = [
  { name: "MUDRA", type: "3BHK Residence · Pune", image: mudraImage, slug: "mudra", number: "01", note: "A warm, considered home shaped by material, light and everyday ritual." },
  { name: "MATERIAL COMPOSITION", type: "Interior · Visual study", image: detailImage, slug: "interior-study", number: "02", note: "An exploration of crafted detail, tactile surfaces and quiet contrast." },
  { name: "ARCHITECTURE & LIGHT", type: "Architecture · Visual study", image: architectureImage, slug: "architecture-study", number: "03", note: "A study in volume, shadow and the relationship between inside and out." },
];

const materials = [
  ["Wood", "Warm timber brings tactility and a softer visual rhythm.", detailImage],
  ["Stone", "Natural stone introduces permanence, texture and quiet contrast.", architectureImage],
  ["Fabric", "Textiles soften hard surfaces and create a sense of comfort.", interiorImage],
  ["Light", "Light changes the way a space is perceived throughout the day.", heroImage],
];

const process = [
  ["Discover", "Understanding context, lifestyle and intent."],
  ["Concept", "Establishing proportion, mood and spatial direction."],
  ["Visualise", "Seeing the atmosphere before it is built."],
  ["Develop", "Resolving material, drawings and detail."],
  ["Realise", "Bringing the design into the finished space."],
];

function useScrollScenes() {
  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
    let frame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const distance = Math.max(1, rect.height - viewport);
        const progress = clamp(-rect.top / distance);
        scene.style.setProperty("--scene-progress", String(progress));
        scene.style.setProperty("--hero-copy-opacity", String(clamp(1 - progress * 2.2)));

        const panels = Array.from(scene.querySelectorAll<HTMLElement>("[data-scene-panel]"));
        panels.forEach((panel, index) => {
          const center = panels.length === 1 ? 0.5 : index / (panels.length - 1);
          const opacity = panels.length === 1 ? 1 : clamp(1 - Math.abs(progress - center) * Math.max(2.4, panels.length * 1.35));
          const offset = panels.length === 1 ? 0 : (center - progress) * 76;
          panel.style.setProperty("--panel-opacity", String(opacity));
          panel.style.setProperty("--panel-y", `${offset}px`);
          panel.style.pointerEvents = opacity > 0.08 ? "auto" : "none";
        });

        const image = scene.querySelector<HTMLElement>("[data-scene-image]");
        if (image) {
          image.style.transform = `scale(${1.1 - progress * 0.1}) translate3d(0, ${progress * -1.8}%, 0)`;
        }
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

export function ScrollHomeExperience() {
  useScrollScenes();

  return (
    <div className="scroll-home">
      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[190svh] bg-foreground text-warm-white">
        <div className="scroll-scene__pin">
          <img data-scene-image src={heroImage} alt="Contemporary UnI Design residence" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/20" />
          <div className="content-shell relative z-10 flex h-full flex-col justify-end pb-20 md:pb-24">
            <div className="max-w-5xl" style={{ opacity: "var(--hero-copy-opacity, 1)", transform: "translate3d(0, calc(var(--scene-progress) * -70px), 0)" }}>
              <p className="editorial-label mb-7 text-warm-white/75">Architecture · Interior · Visualisation</p>
              <h1 className="display-xl">DESIGNING<br />SPACES THAT<br /><span className="text-gold">FEEL DISTINCT.</span></h1>
              <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-end">
                <p className="max-w-md text-base leading-7 text-warm-white/80">UnI Design Group creates thoughtful architectural and interior environments shaped around people, purpose and detail.</p>
                <div className="flex flex-wrap gap-4 md:justify-end">
                  <Button asChild variant="inverse"><Link to="/projects">Explore projects ↗</Link></Button>
                  <Button asChild variant="inverse"><Link to="/contact">Start a project →</Link></Button>
                </div>
              </div>
            </div>
            <div className="mt-12 flex items-center justify-between editorial-label text-warm-white/60">
              <span>UnI Design Group · Pune, India</span><span>Scroll to enter ↓</span>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
      </section>

      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[180svh] bg-background">
        <div className="scroll-scene__pin">
          <div className="content-shell grid h-full items-center gap-10 py-24 md:grid-cols-12">
            <div className="md:col-span-6" data-scene-panel>
              <p className="editorial-label text-gold">01 — The studio</p>
              <h2 className="mt-8 display-lg">SPACES SHAPED<br />BY PURPOSE.</h2>
              <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">From the first spatial idea to the final material detail, we bring architecture, interiors and visualisation together in one considered design process.</p>
            </div>
            <div className="md:col-span-6" data-scene-panel>
              <img src={studioImage} alt="UnI studio design workspace" className="aspect-[4/5] max-h-[70svh] w-full object-cover" />
              <p className="mt-4 editorial-label text-muted-foreground">A thoughtful approach to every detail</p>
            </div>
          </div>
          <div className="absolute bottom-8 right-5 editorial-label text-muted-foreground md:right-10">Keep scrolling · 01 / 07</div>
        </div>
      </section>

      <InteriorWalkthrough />

      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[260svh] bg-foreground text-warm-white">
        <div className="scroll-scene__pin">
          <div className="content-shell flex h-full flex-col justify-center py-20">
            <div className="flex items-end justify-between gap-6">
              <div><p className="editorial-label text-gold">02 — Expertise</p><h2 className="mt-5 display-lg">WHAT WE DO.</h2></div>
              <p className="hidden max-w-xs text-sm leading-6 text-warm-white/55 md:block">Four connected disciplines. One consistent design language.</p>
            </div>
            <div className="relative mt-12 min-h-[390px] flex-1 border-t border-warm-white/20">
              {services.map(([name, copy, number], index) => (
                <article key={name} data-scene-panel className="absolute inset-0 flex flex-col justify-center border-b border-warm-white/15">
                  <div className="flex items-start justify-between gap-5">
                    <span className="editorial-label text-gold">{number} / 04</span>
                    <span className="editorial-label text-warm-white/40">UnI · Design discipline</span>
                  </div>
                  <h3 className="mt-8 max-w-4xl font-display text-5xl leading-[.95] md:text-8xl">{name}</h3>
                  <p className="mt-7 max-w-xl text-base leading-7 text-warm-white/60 md:text-lg">{copy}</p>
                  <Link to="/services" className="mt-9 inline-flex w-fit items-center gap-4 editorial-label text-gold">Explore service <span>↗</span></Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[300svh] bg-secondary">
        <div className="scroll-scene__pin">
          <div className="content-shell flex h-full flex-col justify-center py-20">
            <div className="flex items-end justify-between gap-6">
              <div><p className="editorial-label text-gold">03 — Selected work</p><h2 className="mt-5 display-lg">SPACES, MADE<br />TANGIBLE.</h2></div>
              <Link to="/projects" className="hidden editorial-label text-gold md:block">View all projects ↗</Link>
            </div>
            <div className="relative mt-10 min-h-0 flex-1">
              {projects.map((project, index) => (
                <article key={project.slug} data-scene-panel className="absolute inset-0 grid items-center gap-8 md:grid-cols-12">
                  <Link to="/projects/$slug" params={{ slug: project.slug }} data-cursor="VIEW PROJECT" className="project-image-wrap block h-full max-h-[58svh] md:col-span-8">
                    <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
                    <span className="project-hover-label editorial-label">View project ↗</span>
                  </Link>
                  <div className="md:col-span-4">
                    <p className="editorial-label text-gold">{project.number} / 03</p>
                    <h3 className="mt-5 font-display text-4xl leading-none md:text-6xl">{project.name}</h3>
                    <p className="mt-4 editorial-label leading-6 text-muted-foreground">{project.type}</p>
                    <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">{project.note}</p>
                    <Link to="/projects/$slug" params={{ slug: project.slug }} className="mt-8 inline-block editorial-label text-gold">Discover the project →</Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between editorial-label text-muted-foreground"><span>Portfolio / 2026</span><span>Scroll to browse</span></div>
          </div>
        </div>
      </section>

      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[250svh] bg-background">
        <div className="scroll-scene__pin">
          <div className="content-shell grid h-full items-center gap-10 py-20 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="editorial-label text-gold">04 — Material language</p>
              <h2 className="mt-6 display-lg">THE DETAILS<br />MATTER.</h2>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">Explore the ingredients that give a space its character. Scroll through the textures, tones and light that shape our work.</p>
              <div className="mt-10 border-t border-border">
                {materials.map(([name], index) => <div key={name} className="flex items-center justify-between border-b border-border py-4"><span className="font-display text-2xl">{name}</span><span className="editorial-label text-gold">0{index + 1}</span></div>)}
              </div>
            </div>
            <div className="relative min-h-[390px] md:col-span-7 md:col-start-6">
              {materials.map(([name, copy, image], index) => <article key={name} data-scene-panel className="absolute inset-0">
                <div className="overflow-hidden"><img src={image} alt={`${name} material study`} className="aspect-[4/3] w-full object-cover" /></div>
                <div className="mt-6 flex items-start justify-between gap-8"><h3 className="font-display text-4xl">{name}</h3><p className="max-w-sm text-sm leading-7 text-muted-foreground">{copy}</p></div>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[260svh] bg-foreground text-warm-white">
        <div className="scroll-scene__pin">
          <div className="content-shell flex h-full flex-col justify-center py-20">
            <p className="editorial-label text-gold">05 — The process</p>
            <h2 className="mt-5 display-lg">FROM FIRST THOUGHT<br />TO FINISHED SPACE.</h2>
            <div className="relative mt-14 grid flex-1 items-center gap-8 md:grid-cols-5">
              <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-warm-white/20 md:block" />
              {process.map(([title, copy], index) => <article key={title} data-scene-panel className="relative">
                <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-gold bg-foreground font-display text-lg text-gold">0{index + 1}</span>
                <h3 className="mt-8 font-display text-3xl md:text-4xl">{title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-warm-white/55">{copy}</p>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <section data-scroll-scene data-motion-skip="true" className="scroll-scene h-[170svh] bg-background">
        <div className="scroll-scene__pin">
          <div className="content-shell grid h-full items-center gap-12 py-20 md:grid-cols-12">
            <div className="md:col-span-7" data-scene-panel><img src={interiorImage} alt="Considered interior by UnI Design Group" className="aspect-[4/5] max-h-[72svh] w-full object-cover" /></div>
            <div className="md:col-span-5" data-scene-panel><p className="editorial-label text-gold">06 — The studio</p><h2 className="mt-7 display-lg">DESIGNING<br />WITH PURPOSE.</h2><p className="mt-7 leading-7 text-muted-foreground">UnI Design Group brings architecture, interior design and visualisation together to create considered spaces shaped around people and place.</p><Button asChild variant="editorial" className="mt-8"><Link to="/about">Meet the studio →</Link></Button></div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="content-shell grid gap-12 md:grid-cols-2 md:items-center">
          <div><p className="editorial-label text-gold">07 — Begin a conversation</p><h2 className="mt-6 display-lg">HAVE A SPACE<br />IN MIND?</h2><p className="mt-6 max-w-md leading-7 text-muted-foreground">Tell us what you are imagining. We would love to understand the brief and explore what it could become.</p><Button asChild variant="editorial" className="mt-8"><Link to="/contact">Start your project →</Link></Button></div>
          <div className="border border-border bg-background p-5 md:p-8"><ContactForm /></div>
        </div>
      </section>

      <ConsultationCta />
      <StudioDynamics />
    </div>
  );
}
