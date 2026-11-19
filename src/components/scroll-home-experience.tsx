import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Link } from "@tanstack/react-router";
import heroImage from "../assets/uni-hero.jpg";
import mudraImage from "../assets/mudra-living.jpg";
import detailImage from "../assets/mudra-detail.jpg";
import architectureImage from "../assets/architecture-study.jpg";
import interiorImage from "../assets/interior-study.jpg";
import studioImage from "../assets/studio.jpg";
import { Button } from "./ui/button";
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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    // Lenis provides consistent inertia; ScrollTrigger is kept in sync with it.
    const lenis = reducedMotion ? null : new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.35 });
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);
    const ticker = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>("[data-scroll-scene]");
      scenes.forEach((scene) => {
        const image = scene.querySelector<HTMLElement>("[data-scene-image]");
        const panels = gsap.utils.toArray<HTMLElement>(scene.querySelectorAll("[data-scene-panel]"));
        if (image && !reducedMotion) {
          gsap.fromTo(image, { scale: 1.12, yPercent: 2 }, {
            scale: 1, yPercent: -2, ease: "none",
            scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1 }
          });
        }
        if (panels.length && !reducedMotion) {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: 0.8 }
          });
          panels.forEach((panel, index) => {
            const total = panels.length;
            const at = index / total;
            timeline.fromTo(panel,
              { autoAlpha: 0, y: 48 },
              { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" }, at
            ).to(panel, { autoAlpha: 0, y: -32, duration: 0.24, ease: "power2.in" }, Math.min(0.98, at + 0.72 / total));
          });
        }
      });

      const hero = document.querySelector<HTMLElement>("[data-home-hero]");
      if (hero && !reducedMotion) {
        const heroImage = hero.querySelector<HTMLElement>("[data-scene-image]");
        const heroCopy = hero.querySelector<HTMLElement>("[data-hero-copy]");
        const intro = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom bottom", scrub: 1 } });
        if (heroImage) intro.to(heroImage, { scale: 0.78, clipPath: "inset(8% 8% 8% 8% round 2px)", ease: "none" }, 0);
        if (heroCopy) intro.to(heroCopy, { y: -90, autoAlpha: 0, ease: "none" }, 0);
      }

      const horizontalScene = document.querySelector<HTMLElement>("[data-horizontal-scene]");
      const horizontalTrack = horizontalScene?.querySelector<HTMLElement>("[data-horizontal-track]");
      if (horizontalScene && horizontalTrack && !reducedMotion) {
        gsap.to(horizontalTrack, {
          x: () => -Math.max(0, horizontalTrack.scrollWidth - window.innerWidth + 40),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalScene,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }

      const expertise = document.querySelector<HTMLElement>("[data-theme-flip]");
      if (expertise && !reducedMotion) {
        ScrollTrigger.create({
          trigger: expertise, start: "top 65%", end: "bottom 35%",
          onEnter: () => document.documentElement.classList.add("studio-dark"),
          onEnterBack: () => document.documentElement.classList.add("studio-dark"),
          onLeave: () => document.documentElement.classList.remove("studio-dark"),
          onLeaveBack: () => document.documentElement.classList.remove("studio-dark")
        });
      }
    });

    return () => {
      context.revert();
      lenis?.off("scroll", onLenisScroll);
      if (lenis) {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

export function ScrollHomeExperience() {
  useScrollScenes();

  return (
    <div className="scroll-home">
      <section data-scroll-scene data-motion-skip="true" id="hero" className="scroll-scene h-[190svh] bg-foreground text-warm-white" data-home-hero>
        <div className="scroll-scene__pin">
          <img data-scene-image src={heroImage} alt="Contemporary UnI Design residence" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/20" />
          <div className="content-shell relative z-10 flex h-full flex-col justify-end pb-20 md:pb-24">
            <div data-hero-copy className="max-w-5xl">
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

      <section data-scroll-scene data-motion-skip="true" id="studio" className="scroll-scene h-[180svh] bg-background">
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

      <div id="walkthrough"><InteriorWalkthrough /></div>

      <section data-scroll-scene data-motion-skip="true" id="expertise" id="process" className="scroll-scene h-[260svh] bg-foreground text-warm-white" data-theme-flip>
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

      <section data-scroll-scene data-motion-skip="true" id="projects" className="scroll-scene h-[300svh] overflow-hidden bg-secondary" data-horizontal-scene>
        <div className="scroll-scene__pin">
          <div className="content-shell flex h-full flex-col justify-center py-20">
            <div className="flex items-end justify-between gap-6">
              <div><p className="editorial-label text-gold">03 — Selected work</p><h2 className="mt-5 display-lg">SPACES, MADE<br />TANGIBLE.</h2></div>
              <Link to="/projects" className="hidden editorial-label text-gold md:block">View all projects ↗</Link>
            </div>
            <div data-horizontal-track className="mt-10 flex min-h-0 flex-1 items-center gap-8 md:gap-12">
              {projects.map((project) => (
                <article key={project.slug} className="grid h-full w-[86vw] max-w-[1180px] shrink-0 items-center gap-6 md:grid-cols-12 md:gap-10">
                  <Link to="/projects/$slug" params={{ slug: project.slug }} data-cursor="VIEW PROJECT" className="project-image-wrap block h-[42svh] max-h-[620px] md:h-[58svh] md:col-span-8">
                    <img src={project.image} alt={project.name} loading="lazy" className="h-full w-full object-cover" />
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

      <section data-scroll-scene data-motion-skip="true" id="materials" className="scroll-scene h-[250svh] bg-background">
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

      <section data-scroll-scene data-motion-skip="true" id="philosophy" className="scroll-scene h-[170svh] bg-background">
        <div className="scroll-scene__pin">
          <div className="content-shell grid h-full items-center gap-12 py-20 md:grid-cols-12">
            <div className="md:col-span-7" data-scene-panel><img src={interiorImage} alt="Considered interior by UnI Design Group" className="aspect-[4/5] max-h-[72svh] w-full object-cover" /></div>
            <div className="md:col-span-5" data-scene-panel><p className="editorial-label text-gold">06 — The studio</p><h2 className="mt-7 display-lg">DESIGNING<br />WITH PURPOSE.</h2><p className="mt-7 leading-7 text-muted-foreground">UnI Design Group brings architecture, interior design and visualisation together to create considered spaces shaped around people and place.</p><Button asChild variant="editorial" className="mt-8"><Link to="/about">Meet the studio →</Link></Button></div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-secondary py-24">
        <div className="content-shell grid gap-12 md:grid-cols-2 md:items-center">
          <div><p className="editorial-label text-gold">07 — Begin a conversation</p><h2 className="mt-6 display-lg">HAVE A SPACE<br />IN MIND?</h2><p className="mt-6 max-w-md leading-7 text-muted-foreground">Tell us what you are imagining. We would love to understand the brief and explore what it could become.</p><Button asChild variant="editorial" className="mt-8"><Link to="/contact">Start your project →</Link></Button></div>
          <div className="border border-border bg-background p-5 md:p-8"><ContactForm /></div>
        </div>
      </section>

      <div id="consultation"><ConsultationCta /></div>
      <div id="interactive-process"><StudioDynamics /></div>
    </div>
  );
}
