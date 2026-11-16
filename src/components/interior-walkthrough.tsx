import { useEffect, useRef } from "react";

const VIDEO_SRC = "/animations/original-video.mp4";
const POSTER_SRC = "/animations/interior-walkthrough/frame_001.png";

export function InteriorWalkthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let metadataReady = video.readyState >= 1;

    const updateFrame = () => {
      frameRef.current = null;
      if (!metadataReady || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollableDistance));
      const nextTime = progress * video.duration;

      // Seek only when the requested frame has moved meaningfully.
      if (Math.abs(video.currentTime - nextTime) > 0.025) {
        video.currentTime = nextTime;
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateFrame);
      }
    };

    const handleMetadata = () => {
      metadataReady = true;
      scheduleUpdate();
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Interior design walkthrough"
      className="relative h-[280svh] bg-foreground text-warm-white"
      data-motion-skip="true"
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[560px] w-full flex-col justify-between overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/40" />
        <div className="content-shell relative z-10 flex items-start justify-between gap-6 pt-8 md:pt-10">
          <div>
            <p className="editorial-label text-warm-white/70">03 — Inside the space</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight tracking-tight md:text-5xl">
              A WALK THROUGH<br className="hidden sm:block" /> THOUGHTFUL DESIGN.
            </h2>
          </div>
          <span className="editorial-label hidden pt-1 text-warm-white/60 sm:block">Scroll to explore ↓</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-0 py-28 md:px-8 md:py-32">
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="auto"
            aria-label="Scroll-controlled walkthrough moving from the living room through the kitchen and dining area"
          />
        </div>

        <div className="content-shell relative z-10 flex items-end justify-between pb-7 md:pb-9">
          <p className="editorial-label text-warm-white/70">Living · Kitchen · Dining</p>
          <p className="editorial-label text-warm-white/70">Scroll to move through the space</p>
        </div>
      </div>
    </section>
  );
}
