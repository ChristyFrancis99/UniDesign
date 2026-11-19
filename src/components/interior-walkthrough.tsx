import { useEffect, useRef } from "react";

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

    let animationFrame = 0;
    let isSeeking = false;
    let metadataReady = video.readyState >= HTMLMediaElement.HAVE_METADATA;
    let targetProgress = 0;
    let displayedProgress = 0;
    let lastSeekTime = -1;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const readScrollProgress = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
      targetProgress = clamp((window.scrollY - sectionTop) / scrollRange);
      requestFrame();
    };

    const render = () => {
      animationFrame = 0;

      // Ease the video timeline toward the actual scroll position. This keeps
      // small wheel/touch movements from feeling like abrupt frame jumps.
      displayedProgress += (targetProgress - displayedProgress) * 0.18;
      if (Math.abs(targetProgress - displayedProgress) < 0.001) {
        displayedProgress = targetProgress;
      }

      if (progressBar) {
        progressBar.style.transform = `scaleX(${displayedProgress})`;
      }

      if (metadataReady && Number.isFinite(video.duration) && video.duration > 0) {
        const nextTime = displayedProgress * video.duration;
        const shouldSeek =
          Math.abs(nextTime - video.currentTime) > 0.045 &&
          Math.abs(nextTime - lastSeekTime) > 0.045;

        if (!isSeeking && !video.seeking && shouldSeek) {
          isSeeking = true;
          lastSeekTime = nextTime;
          video.currentTime = nextTime;
        }
      }

      if (Math.abs(targetProgress - displayedProgress) >= 0.001) {
        requestFrame();
      }
    };

    const requestFrame = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      // Queue the latest scroll position after the browser has decoded the
      // previous frame, rather than allowing stale seeks to pile up.
      if (Math.abs(targetProgress - displayedProgress) >= 0.001) {
        requestFrame();
      } else if (metadataReady) {
        requestFrame();
      }
    };

    const handleMetadata = () => {
      metadataReady = true;
      readScrollProgress();
    };

    video.pause();
    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("scroll", readScrollProgress, { passive: true });
    window.addEventListener("resize", readScrollProgress);
    readScrollProgress();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("scroll", readScrollProgress);
      window.removeEventListener("resize", readScrollProgress);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
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
