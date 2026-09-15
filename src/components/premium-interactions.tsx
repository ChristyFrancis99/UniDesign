import { useEffect } from "react";

export function PremiumInteractions() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progress.style.transform = `scaleX(${value})`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || reduced) {
      return () => {
        window.removeEventListener("scroll", updateProgress);
        progress.remove();
      };
    }

    const cursor = document.createElement("div");
    cursor.className = "premium-cursor";
    cursor.innerHTML = '<span class="premium-cursor-dot"></span><span class="premium-cursor-label"></span>';
    document.body.appendChild(cursor);

    const label = cursor.querySelector<HTMLElement>(".premium-cursor-label");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const render = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const text = target?.dataset.cursor || "";
      cursor.classList.toggle("is-active", Boolean(text));
      if (label) label.textContent = text;
    };

    const magnetic = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const magneticHandlers = magnetic.map((element) => {
      const onMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        element.style.transform = `translate3d(${dx * 0.08}px, ${dy * 0.08}px, 0)`;
      };
      const onLeave = () => { element.style.transform = ""; };
      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      return { element, onMove, onLeave };
    });

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      magneticHandlers.forEach(({ element, onMove, onLeave }) => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      });
      cursor.remove();
      progress.remove();
    };
  }, []);

  return null;
}
