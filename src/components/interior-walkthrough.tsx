import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VIDEO_SRC = "/animations/original-video.mp4";
const POSTER_SRC = "/animations/interior-walkthrough/frame_001.png";

export function InteriorWalkthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!section || !video) return;

    gsap.registerPlugin(ScrollTrigger);
    video.pause();
    let scrubTween: gsap.core.Tween | undefined;
    let trigger: ScrollTrigger | undefined;

    const setupScrub = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0 || scrubTween) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      scrubTween = gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) gsap.set(progressBar, { scaleX: self.progress });
          },
        },
      });
      trigger = scrubTween.scrollTrigger as ScrollTrigger;
      ScrollTrigger.refresh();
    };

    video.addEventListener("loadedmetadata", setupScrub);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) setupScrub();

    return () => {
      video.removeEventListener("loadedmetadata", setupScrub);
      scrubTween?.scrollTrigger?.kill();
      scrubTween?.kill();
      trigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-controlled interior walkthrough"
      className="relative h-[360svh] bg-[#11110f] text-warm-white"
      data-motion-skip="true"
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[560px] w-full flex-col justify-between overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_68%)]" />

        <div className="content-shell relative z-10 flex items-start justify-between gap-6 pt-8 md:pt-10">
          <div>
            <p className="editorial-label text-warm-white/65">A closer look · UnI Design Group</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight tracking-tight md:text-5xl">
              STEP INSIDE
              <br />
              THE DESIGN.
            </h2>
          </div>
          <span className="editorial-label hidden pt-1 text-warm-white/55 sm:block">
            Scroll to control the film ↓
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-0 py-28 md:px-8 md:py-32">
          <div className="relative flex h-full w-full items-center justify-center">
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-label="Interior walkthrough controlled by page scrolling"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="h-[2px] w-full bg-warm-white/15">
            <div
              ref={progressRef}
              className="h-full origin-left scale-x-0 bg-[#c7a76a] will-change-transform"
            />
          </div>
          <div className="content-shell flex items-end justify-between py-6 md:py-8">
            <p className="editorial-label text-warm-white/60">Architecture · Interior · Detail</p>
            <p className="editorial-label text-warm-white/60">Scroll down to move forward · Up to rewind</p>
          </div>
        </div>
      </div>
    </section>
  );
}
