import { Link } from "@tanstack/react-router";
import ctaImage from "../assets/cta-interior.jpg";
import { Button } from "./ui/button";

export function ConsultationCta() {
  return (
    <section
      data-scroll-scene
      data-motion-skip="true"
      className="scroll-scene h-[160svh] bg-foreground text-center text-warm-white"
    >
      <div className="scroll-scene__pin flex items-center justify-center">
        <img
          data-scene-image
          src={ctaImage}
          width={1920}
          height={1104}
          loading="lazy"
          alt="Calm contemporary bedroom with warm natural materials"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="content-shell relative z-10 px-5">
          <p className="editorial-label mb-8 text-gold">09 — Begin a conversation</p>
          <h2 className="display-lg">HAVE A SPACE<br />IN MIND?</h2>
          <p className="mt-6 text-lg text-warm-white/75">Let's start a conversation.</p>
          <Button asChild variant="inverse" className="mt-9">
            <Link to="/contact">Book a free consultation <span aria-hidden>→</span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
